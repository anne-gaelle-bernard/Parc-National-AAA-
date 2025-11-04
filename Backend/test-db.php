<?php
require_once 'config/db.php';

echo "Testing database connection...\n";

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo "✓ Database connected successfully!\n";
    echo "Server info: " . $conn->getAttribute(PDO::ATTR_SERVER_INFO) . "\n";
    
    // Test if reservation table exists
    $query = "SELECT COUNT(*) as count FROM reservation";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✓ Reservation table exists with " . $result['count'] . " records\n";
    
    // Show last 3 reservations
    $query = "SELECT id, user_id, campsite_id, check_in_date, status FROM reservation ORDER BY id DESC LIMIT 3";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nLast 3 reservations:\n";
    if (count($reservations) > 0) {
        foreach ($reservations as $r) {
            echo "  - ID: {$r['id']}, User: {$r['user_id']}, Campsite: {$r['campsite_id']}, Date: {$r['check_in_date']}, Status: {$r['status']}\n";
        }
    } else {
        echo "  No reservations found.\n";
    }
} else {
    echo "✗ Failed to connect to database\n";
}
