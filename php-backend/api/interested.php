<?php
/**
 * StayMate - Interested Students & Visit Scheduling API
 * Endpoints for students to express interest / book visits and admins to track leads.
 */

session_start();
require_once __DIR__ . '/../config/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to check logged in user
function getCurrentUser() {
    return $_SESSION['user'] ?? null;
}

// -------------------------------------------------------------
// POST: Submit visit inquiry or mark interest
// -------------------------------------------------------------
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $user = getCurrentUser();
    $userId = $user ? $user['id'] : (int)($data['user_id'] ?? 0);
    $propertyId = (int)($data['property_id'] ?? 0);
    $visitDate = $data['visit_date'] ?? date('Y-m-d', strtotime('+2 days'));
    $timeSlot = trim($data['time_slot'] ?? 'Morning (10:00 AM - 12:00 PM)');
    $sharingPreference = trim($data['sharing_preference'] ?? 'Double Sharing');
    $notes = trim($data['notes'] ?? '');

    if ($userId <= 0 || $propertyId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'User ID and Property ID are required. Please login first.']);
        exit();
    }

    // Check if duplicate entry already exists
    $checkStmt = $pdo->prepare('SELECT id FROM interested_users WHERE user_id = ? AND property_id = ? LIMIT 1');
    $checkStmt->execute([$userId, $propertyId]);
    if ($checkStmt->fetch()) {
        echo json_encode([
            'status' => 'info',
            'message' => 'You have already expressed interest in this property! Check your Student Dashboard.'
        ]);
        exit();
    }

    $stmt = $pdo->prepare('
        INSERT INTO interested_users (user_id, property_id, visit_date, time_slot, sharing_preference, status, notes)
        VALUES (?, ?, ?, ?, ?, "Visit Scheduled", ?)
    ');
    $stmt->execute([$userId, $propertyId, $visitDate, $timeSlot, $sharingPreference, $notes]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Visit scheduled successfully! The property manager will contact you.',
        'id' => (int)$pdo->lastInsertId()
    ]);
    exit();
}

// -------------------------------------------------------------
// GET: List student's own inquiries OR all inquiries for Admin
// -------------------------------------------------------------
if ($method === 'GET') {
    $user = getCurrentUser();
    $scope = $_GET['scope'] ?? 'my';

    if ($scope === 'all') {
        // Admin only
        if (!$user || $user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'Admin authorization required']);
            exit();
        }

        $stmt = $pdo->query('
            SELECT iu.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.college as user_college,
                   p.name as property_name, p.location as property_location, p.price as property_price, p.image as property_image
            FROM interested_users iu
            JOIN users u ON iu.user_id = u.id
            JOIN properties p ON iu.property_id = p.id
            ORDER BY iu.created_at DESC
        ');
        $leads = $stmt->fetchAll();

        echo json_encode(['status' => 'success', 'data' => $leads]);
        exit();
    }

    // Student inquiries
    $userId = $user ? $user['id'] : (int)($_GET['user_id'] ?? 0);
    if ($userId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
        exit();
    }

    $stmt = $pdo->prepare('
        SELECT iu.*, p.name as property_name, p.location as property_location, p.price as property_price, p.image as property_image, p.contact_phone
        FROM interested_users iu
        JOIN properties p ON iu.property_id = p.id
        WHERE iu.user_id = ?
        ORDER BY iu.created_at DESC
    ');
    $stmt->execute([$userId]);
    $myLeads = $stmt->fetchAll();

    echo json_encode(['status' => 'success', 'data' => $myLeads]);
    exit();
}

// -------------------------------------------------------------
// PUT: Update inquiry status (Admin only)
// -------------------------------------------------------------
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $inquiryId = (int)($data['id'] ?? 0);
    $newStatus = $data['status'] ?? 'Contacted';

    if ($inquiryId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Inquiry ID is required']);
        exit();
    }

    $stmt = $pdo->prepare('UPDATE interested_users SET status = ? WHERE id = ?');
    $stmt->execute([$newStatus, $inquiryId]);

    echo json_encode(['status' => 'success', 'message' => 'Status updated to ' . $newStatus]);
    exit();
}
?>
