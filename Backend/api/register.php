<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
session_start();
require '..\db.php';


if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(["status" => "error", "message" => "Données JSON invalides."]);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];
$first_name = trim($data['first_name']);
$last_name = trim($data['last_name']);

if (!$email || !$password || !$first_name || !$last_name) {
    echo json_encode(["status" => "error", "message" => "Tous les champs sont requis."]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$role = str_ends_with($email, '@parcnational.com') ? 'admin' : 'visitor';

$stmt = $pdo->prepare("INSERT INTO user (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)");

try {
    $stmt->execute([$email, $hashedPassword, $first_name, $last_name, $role]);

    echo json_encode([
        "status" => "success",
        "message" => "Inscription réussie ! Vous pouvez maintenant vous connecter.",
        "user" => [
            "first_name" => $first_name,
            "last_name" => $last_name,
            "role" => $role
        ]
    ]);
} catch (PDOException $e) {
    
    if ($e->getCode() === "23000") {
        echo json_encode(["status" => "error", "message" => "Cet email est déjà utilisé."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : " . $e->getMessage()]);
    }
}
?>