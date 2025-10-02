<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require '..\db.php';


if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

    $email = trim($data['email']);
    $password = $data['password'];

    $stmt = $pdo->prepare("SELECT id, password_hash, role, first_name, last_name FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];

        echo json_encode([
            "status" => "success",
            "user" => [
                "first_name" => $user['first_name'],
                "last_name" => $user['last_name'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email ou mot de passe incorrect"]);
    }


?>
