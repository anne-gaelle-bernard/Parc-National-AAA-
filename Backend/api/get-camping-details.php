<?php
require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json');

$database = new Database();
$db = $database->getConnection();

$campingId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($campingId === 0) {
    echo json_encode(['status' => 'error', 'message' => 'ID de camping manquant.']);
    exit();
}

$query = "SELECT id, name, location, description FROM camping WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $campingId, PDO::PARAM_INT);
$stmt->execute();

$camping = $stmt->fetch(PDO::FETCH_ASSOC);

if ($camping) {
    $camping['image'] = '/Parc-National-AAA-/Frontend/assets/img/Camping de ' . strtoupper(str_replace('Camping ', '', $camping['name'])) . '.jpg';

    // Fetch campsites for this camping
    $campsitesQuery = "SELECT id, number, max_capacity, price_per_night FROM campsite WHERE camping_id = :camping_id";
    $campsitesStmt = $db->prepare($campsitesQuery);
    $campsitesStmt->bindParam(':camping_id', $campingId, PDO::PARAM_INT);
    $campsitesStmt->execute();
    $campsites = $campsitesStmt->fetchAll(PDO::FETCH_ASSOC);

    $camping['campsites'] = $campsites;

    echo json_encode(['status' => 'success', 'camping' => $camping]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Camping non trouvé.']);
}
?>
