<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, name, location, description FROM camping";
$stmt = $db->prepare($query);
$stmt->execute();

$campings = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $row['image'] = '/Parc-National-AAA-/Frontend/assets/img/Camping de ' . strtoupper(str_replace('Camping ', '', $row['name'])) . '.jpg';
    $campings[] = $row;
}

echo json_encode(['status' => 'success', 'campings' => $campings]);
?>
