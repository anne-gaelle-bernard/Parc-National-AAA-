<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/controllers/UserController.php';
require_once __DIR__ . '/../src/middlewares/JwtMiddleware.php';

$payload = JwtMiddleware::authenticate();

$database = new Database();
$db = $database->getConnection();
$userController = new UserController($db);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->first_name) || empty($data->last_name) || empty($data->email)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Les champs prénom, nom et email ne peuvent pas être vides."]);
    exit();
}

$result = $userController->updateUserProfile($payload['sub'], $data);

if ($result) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => "Profil mis à jour avec succès.", "user" => $userController->getUserProfile($payload['sub'])]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Impossible de mettre à jour le profil utilisateur."]);
}
