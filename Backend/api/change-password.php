<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

if (empty($data->current_password) || empty($data->new_password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Les champs du mot de passe ne peuvent pas être vides."]);
    exit();
}

$result = $userController->changeUserPassword($payload['sub'], $data->current_password, $data->new_password);

if ($result['success']) {
    http_response_code(200);
    echo json_encode(["status" => "success", "message" => $result['message']]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => $result['message']]);
}
