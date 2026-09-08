<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Trail.php';
require_once __DIR__ . '/../src/middlewares/JwtMiddleware.php';

$database = new Database();
$db = $database->getConnection();
$trail = new Trail($db);

$method = $_SERVER['REQUEST_METHOD'];

// Trail listing/detail is public; creating, editing and deleting trails
// requires an authenticated admin.
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $trail->id = $_GET['id'];
        if (!$trail->readOne()) {
            http_response_code(404);
            echo json_encode(["message" => "Sentier non trouvé."]);
            exit();
        }
        echo json_encode([
            "id" => $trail->id,
            "name" => $trail->name,
            "difficulty" => $trail->difficulty,
            "estimated_duration" => $trail->estimated_duration,
            "description" => $trail->description,
            "map_url" => $trail->map_url,
            "points_of_interest" => $trail->readPointsOfInterest($trail->id),
        ]);
        exit();
    }

    $stmt = $trail->readAll();
    $trails = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $row['points_of_interest'] = $trail->readPointsOfInterest($row['id']);
        $trails[] = $row;
    }
    echo json_encode($trails);
    exit();
}

JwtMiddleware::authenticate('admin');
$data = json_decode(file_get_contents("php://input"));

if ($method === 'POST') {
    if (!isset($data->name) || !isset($data->difficulty)) {
        http_response_code(400);
        echo json_encode(["message" => "Nom et difficulté requis."]);
        exit();
    }

    $trail->name = $data->name;
    $trail->difficulty = $data->difficulty;
    $trail->estimated_duration = $data->estimated_duration ?? null;
    $trail->description = $data->description ?? null;
    $trail->map_url = $data->map_url ?? null;

    if (!$trail->create()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible de créer le sentier."]);
        exit();
    }

    $trail->id = $db->lastInsertId();
    if (isset($data->points_of_interest) && is_array($data->points_of_interest)) {
        $trail->replacePointsOfInterest($trail->id, $data->points_of_interest);
    }

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Sentier créé avec succès.", "id" => $trail->id]);
} elseif ($method === 'PUT') {
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Identifiant du sentier requis."]);
        exit();
    }

    $trail->id = $data->id;
    if (!$trail->readOne()) {
        http_response_code(404);
        echo json_encode(["message" => "Sentier non trouvé."]);
        exit();
    }

    $trail->name = $data->name ?? $trail->name;
    $trail->difficulty = $data->difficulty ?? $trail->difficulty;
    $trail->estimated_duration = $data->estimated_duration ?? $trail->estimated_duration;
    $trail->description = $data->description ?? $trail->description;
    $trail->map_url = $data->map_url ?? $trail->map_url;

    if (!$trail->update()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible de mettre à jour le sentier."]);
        exit();
    }

    if (isset($data->points_of_interest) && is_array($data->points_of_interest)) {
        $trail->replacePointsOfInterest($trail->id, $data->points_of_interest);
    }

    echo json_encode(["status" => "success", "message" => "Sentier mis à jour avec succès."]);
} elseif ($method === 'DELETE') {
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Identifiant du sentier requis."]);
        exit();
    }

    $trail->id = $data->id;
    if (!$trail->delete()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible de supprimer le sentier."]);
        exit();
    }

    echo json_encode(["status" => "success", "message" => "Sentier supprimé avec succès."]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée."]);
}
