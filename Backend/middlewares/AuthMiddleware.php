<?php
// AuthMiddleware.php
session_start();

function requireAuth() {
	if (!isset($_SESSION['user_id'])) {
		header('Content-Type: application/json');
		http_response_code(401);
		echo json_encode(['success' => false, 'message' => 'Authentification requise.']);
		exit;
	}
}
?>
