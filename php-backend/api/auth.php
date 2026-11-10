<?php
/**
 * StayMate - Student Authentication API
 * Endpoints:
 * - action=register (POST)
 * - action=login (POST)
 * - action=me (GET)
 * - action=logout (POST)
 */

session_start();
require_once __DIR__ . '/../config/db_connect.php';

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name     = trim($data['name'] ?? '');
    $email    = trim($data['email'] ?? '');
    $phone    = trim($data['phone'] ?? '');
    $password = $data['password'] ?? '';
    $college  = trim($data['college'] ?? '');
    $role     = in_array($data['role'] ?? '', ['student', 'admin']) ? $data['role'] : 'student';

    // Validation
    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Full name must be at least 2 characters.']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
        exit();
    }

    $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($cleanPhone) < 10) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid 10-digit phone number.']);
        exit();
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters long.']);
        exit();
    }

    // Check if email already registered
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Email address is already registered. Please login.']);
        exit();
    }

    // Secure password hashing using BCRYPT
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $insertStmt = $pdo->prepare('INSERT INTO users (name, email, password, phone, role, college) VALUES (?, ?, ?, ?, ?, ?)');
    $success = $insertStmt->execute([$name, $email, $hashedPassword, $phone, $role, $college]);

    if ($success) {
        $userId = $pdo->lastInsertId();
        $user = [
            'id' => (int)$userId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'role' => $role,
            'college' => $college
        ];
        $_SESSION['user'] = $user;

        echo json_encode([
            'status' => 'success',
            'message' => 'Student registration successful!',
            'user' => $user
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
    }
    exit();
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
        exit();
    }

    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']); // Never expose hash in responses
        $_SESSION['user'] = $user;

        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful! Welcome back, ' . $user['name'],
            'user' => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    }
    exit();
}

if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode(['status' => 'success', 'user' => $_SESSION['user']]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    }
    exit();
}

if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_destroy();
    echo json_encode(['status' => 'success', 'message' => 'Successfully logged out']);
    exit();
}

http_response_code(400);
echo json_encode(['status' => 'error', 'message' => 'Invalid action parameter']);
?>
