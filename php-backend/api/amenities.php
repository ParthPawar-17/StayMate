<?php
/**
 * StayMate - Amenities API
 */

require_once __DIR__ . '/../config/db_connect.php';

try {
    $stmt = $pdo->query('SELECT * FROM amenities ORDER BY category, id');
    $amenities = $stmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'data' => $amenities
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
