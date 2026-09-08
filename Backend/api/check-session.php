<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/controllers/UserController.php';
require_once __DIR__ . '/../src/middlewares/JwtMiddleware.php';

$payload = JwtMiddleware::optionalAuthenticate();

if (!$payload) {
    echo json_encode(["loggedIn" => false]);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$userController = new UserController($db);

$user = $userController->getUserProfile($payload['sub']);

if (!$user) {
    echo json_encode(["loggedIn" => false]);
    exit();
}

echo json_encode([
    "loggedIn" => true,
    "user" => [
        "id" => $user['id'],
        "first_name" => $user['first_name'],
        "last_name" => $user['last_name'],
        "email" => $user['email'],
        "role" => $user['role'],
    ]
]);
