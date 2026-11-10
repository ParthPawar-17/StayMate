<?php
/**
 * StayMate - Properties API
 * Handles Property search, filtering, detail retrieval, and Admin CRUD.
 */

session_start();
require_once __DIR__ . '/../config/db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Helper to check admin role
function requireAdmin() {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized: Admin privileges required.']);
        exit();
    }
}

// -------------------------------------------------------------
// GET: Fetch list of properties or single property details
// -------------------------------------------------------------
if ($method === 'GET') {
    // 1. Single property detail view
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare('SELECT * FROM properties WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $property = $stmt->fetch();

        if (!$property) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Property not found']);
            exit();
        }

        // Fetch associated amenities
        $amenityStmt = $pdo->prepare('
            SELECT a.id, a.name, a.category 
            FROM amenities a
            INNER JOIN property_amenities pa ON a.id = pa.amenity_id
            WHERE pa.property_id = ?
        ');
        $amenityStmt->execute([$id]);
        $property['amenities'] = $amenityStmt->fetchAll();

        echo json_encode(['status' => 'success', 'data' => $property]);
        exit();
    }

    // 2. Filtered list of properties
    $city       = $_GET['city'] ?? 'All';
    $gender     = $_GET['gender'] ?? 'All';
    $minPrice   = isset($_GET['min_price']) ? (float)$_GET['min_price'] : 0;
    $maxPrice   = isset($_GET['max_price']) ? (float)$_GET['max_price'] : 999999;
    $search     = trim($_GET['search'] ?? '');
    $sortBy     = $_GET['sort'] ?? 'popular';

    $sql = 'SELECT p.* FROM properties p WHERE 1=1';
    $params = [];

    if ($city !== 'All' && !empty($city)) {
        $sql .= ' AND p.city = ?';
        $params[] = $city;
    }

    if ($gender !== 'All' && !empty($gender)) {
        $sql .= ' AND p.gender = ?';
        $params[] = $gender;
    }

    if ($minPrice > 0) {
        $sql .= ' AND p.price >= ?';
        $params[] = $minPrice;
    }

    if ($maxPrice > 0) {
        $sql .= ' AND p.price <= ?';
        $params[] = $maxPrice;
    }

    if (!empty($search)) {
        $sql .= ' AND (p.name LIKE ? OR p.location LIKE ? OR p.address LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    // Sorting
    switch ($sortBy) {
        case 'price-asc':
            $sql .= ' ORDER BY p.price ASC';
            break;
        case 'price-desc':
            $sql .= ' ORDER BY p.price DESC';
            break;
        case 'rating-desc':
            $sql .= ' ORDER BY p.rating DESC, p.review_count DESC';
            break;
        default:
            $sql .= ' ORDER BY p.featured DESC, p.rating DESC';
            break;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();

    // Attach amenities to each property
    foreach ($properties as &$prop) {
        $amenityStmt = $pdo->prepare('
            SELECT a.name 
            FROM amenities a
            INNER JOIN property_amenities pa ON a.id = pa.amenity_id
            WHERE pa.property_id = ?
        ');
        $amenityStmt->execute([$prop['id']]);
        $prop['amenities'] = array_column($amenityStmt->fetchAll(), 'name');
    }

    echo json_encode([
        'status' => 'success',
        'count' => count($properties),
        'data' => $properties
    ]);
    exit();
}

// -------------------------------------------------------------
// POST: Add new property (Admin only)
// -------------------------------------------------------------
if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    $name         = trim($data['name'] ?? '');
    $city         = trim($data['city'] ?? 'Nagpur');
    $location     = trim($data['location'] ?? '');
    $address      = trim($data['address'] ?? '');
    $price        = (float)($data['price'] ?? 0);
    $deposit      = (float)($data['deposit'] ?? 5000);
    $gender       = in_array($data['gender'] ?? '', ['Boys', 'Girls', 'Co-living']) ? $data['gender'] : 'Boys';
    $description  = trim($data['description'] ?? '');
    $image        = trim($data['image'] ?? '');
    $contactOwner = trim($data['contact_owner'] ?? 'Property Manager');
    $contactPhone = trim($data['contact_phone'] ?? '');
    $amenities    = $data['amenity_ids'] ?? [];

    if (empty($name) || empty($location) || $price <= 0 || empty($image)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please provide all required fields.']);
        exit();
    }

    $stmt = $pdo->prepare('
        INSERT INTO properties (name, city, location, address, price, deposit, gender, description, image, contact_owner, contact_phone, verified, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
    ');
    $stmt->execute([$name, $city, $location, $address, $price, $deposit, $gender, $description, $image, $contactOwner, $contactPhone]);
    $newId = (int)$pdo->lastInsertId();

    // Insert amenities mapping
    if (!empty($amenities) && is_array($amenities)) {
        $paStmt = $pdo->prepare('INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?)');
        foreach ($amenities as $aId) {
            $paStmt->execute([$newId, (int)$aId]);
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Property listed successfully!',
        'id' => $newId
    ]);
    exit();
}

// -------------------------------------------------------------
// DELETE: Remove property (Admin only)
// -------------------------------------------------------------
if ($method === 'DELETE') {
    requireAdmin();
    $id = (int)($_GET['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid property ID']);
        exit();
    }

    $stmt = $pdo->prepare('DELETE FROM properties WHERE id = ?');
    $stmt->execute([$id]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Property removed successfully.'
    ]);
    exit();
}
?>
