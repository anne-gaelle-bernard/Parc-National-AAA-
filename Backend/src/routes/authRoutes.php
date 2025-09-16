<?php
// authRoutes.php
require_once '../../config/db.php';

// Helper function to send JSON response
function sendJson($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Register route
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $firstName = $data['firstName'] ?? '';
    $lastName = $data['lastName'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (!$firstName || !$lastName || !$email || !$password) {
        sendJson(['success' => false, 'message' => 'Tous les champs sont requis.']);
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare('SELECT id FROM user WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        sendJson(['success' => false, 'message' => 'Email déjà utilisé.']);
    }
    $stmt->close();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $role = 'visitor';
    $stmt = $conn->prepare('INSERT INTO user (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $firstName, $lastName, $email, $hashedPassword, $role);
    if ($stmt->execute()) {
        sendJson(['success' => true, 'message' => 'Inscription réussie.']);
    } else {
        sendJson(['success' => false, 'message' => "Erreur lors de l'inscription."]);
    }
    $stmt->close();
    $conn->close();
}

// Login route
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        sendJson(['success' => false, 'message' => 'Email et mot de passe requis.']);
    }

    $conn = getDbConnection();
    $stmt = $conn->prepare('SELECT id, password_hash, first_name, last_name, role FROM user WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows === 0) {
        sendJson(['success' => false, 'message' => 'Utilisateur non trouvé.']);
    }
    $stmt->bind_result($id, $hashedPassword, $firstName, $lastName, $role);
    $stmt->fetch();
    if (password_verify($password, $hashedPassword)) {
        sendJson(['success' => true, 'message' => 'Connexion réussie.', 'user' => ['id' => $id, 'firstName' => $firstName, 'lastName' => $lastName, 'email' => $email, 'role' => $role]]);
    } else {
        sendJson(['success' => false, 'message' => 'Mot de passe incorrect.']);
    }
    $stmt->close();
    $conn->close();
}
?>
