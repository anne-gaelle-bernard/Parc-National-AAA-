<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

session_start();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/controllers/UserController.php';

$database = new Database();
$db = $database->getConnection();

$userController = new UserController($db);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Non autorisé."));
    exit();
}

$userId = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"));

if (empty($data->first_name) || empty($data->last_name) || empty($data->email)) {
    http_response_code(400);
    echo json_encode(array("message" => "Les champs prénom, nom et email ne peuvent pas être vides."));
    exit();
}

$result = $userController->updateUserProfile($userId, $data);

if ($result) {
    http_response_code(200);
    echo json_encode(array("message" => "Profil utilisateur mis à jour avec succès."));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Impossible de mettre à jour le profil utilisateur."));
}
