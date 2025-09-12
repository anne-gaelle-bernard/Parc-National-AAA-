<?php
require_once __DIR__ . '/../controllers/ReservationController.php';
require_once __DIR__ . '/../../config/db.php';

$controller = new ReservationController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['camping'])) {
	$places = [];
	for ($i = 1; $i <= 5; $i++) {
		$places[$i] = $controller->getPlaces($_GET['camping'], $i);
	}
	header('Content-Type: application/json');
	echo json_encode($places);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$data = json_decode(file_get_contents('php://input'), true);
	$success = $controller->reserver($data);
	header('Content-Type: application/json');
	echo json_encode(['success' => $success]);
	exit;
}

