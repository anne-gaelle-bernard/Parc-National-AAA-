<?php
require_once 'config/db.php';

echo "Testing reservation creation (simulating frontend POST)...\n\n";

$database = new Database();
$conn = $database->getConnection();

// Simulate a reservation request
$testData = (object)[
    'user_id' => 3, // Using existing user from last reservations
    'campsite_id' => 1,
    'check_in_date' => '2025-11-20',
    'check_out_date' => '2025-11-22',
    'number_of_persons' => 2,
    'total_price' => 80.00
];

echo "Test data:\n";
echo "  User ID: {$testData->user_id}\n";
echo "  Campsite ID: {$testData->campsite_id}\n";
echo "  Check-in: {$testData->check_in_date}\n";
echo "  Check-out: {$testData->check_out_date}\n";
echo "  Persons: {$testData->number_of_persons}\n";
echo "  Total price: {$testData->total_price} €\n\n";

// Test 1: Check if campsite exists
$queryCampsite = "SELECT max_capacity, price_per_night FROM campsite WHERE id = ? LIMIT 0,1";
$stmtCampsite = $conn->prepare($queryCampsite);
$stmtCampsite->bindParam(1, $testData->campsite_id);
$stmtCampsite->execute();
$campsite = $stmtCampsite->fetch(PDO::FETCH_ASSOC);

if (!$campsite) {
    echo "✗ Campsite not found!\n";
    exit(1);
}
echo "✓ Campsite found: capacity={$campsite['max_capacity']}, price={$campsite['price_per_night']}€/night\n";

// Test 2: Insert reservation
$query = "INSERT INTO reservation (user_id, campsite_id, check_in_date, check_out_date, number_of_persons, total_price) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);

$stmt->bindParam(1, $testData->user_id);
$stmt->bindParam(2, $testData->campsite_id);
$stmt->bindParam(3, $testData->check_in_date);
$stmt->bindParam(4, $testData->check_out_date);
$stmt->bindParam(5, $testData->number_of_persons);
$stmt->bindParam(6, $testData->total_price);

if ($stmt->execute()) {
    $reservationId = $conn->lastInsertId();
    echo "✓ Reservation created successfully! ID: {$reservationId}\n\n";
    
    // Verify it exists
    $verifyQuery = "SELECT * FROM reservation WHERE id = ?";
    $verifyStmt = $conn->prepare($verifyQuery);
    $verifyStmt->bindParam(1, $reservationId);
    $verifyStmt->execute();
    $newReservation = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($newReservation) {
        echo "Verification - Reservation details:\n";
        echo "  ID: {$newReservation['id']}\n";
        echo "  User ID: {$newReservation['user_id']}\n";
        echo "  Campsite ID: {$newReservation['campsite_id']}\n";
        echo "  Check-in: {$newReservation['check_in_date']}\n";
        echo "  Check-out: {$newReservation['check_out_date']}\n";
        echo "  Status: {$newReservation['status']}\n";
        echo "  Total price: {$newReservation['total_price']}€\n";
    }
} else {
    echo "✗ Failed to create reservation\n";
    print_r($stmt->errorInfo());
}
