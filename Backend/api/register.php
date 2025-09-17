<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../src/controllers/UserController.php';

$database = new Database();
$db = $database->getConnection();

$userController = new UserController($db);

$data = json_decode(file_get_contents("php://input"));

$result = $userController->register($data);

http_response_code(200);
echo json_encode($result);
