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
require_once __DIR__ . '/../models/Resource.php';
require_once __DIR__ . '/../src/middlewares/JwtMiddleware.php';

$database = new Database();
$db = $database->getConnection();
$resource = new Resource($db);

$method = $_SERVER['REQUEST_METHOD'];

// Reading resources / the report is public (visitor sensitisation); only
// admins can log or edit observations.
if ($method === 'GET') {
    if (isset($_GET['report'])) {
        echo json_encode($resource->report());
        exit();
    }

    if (isset($_GET['id'])) {
        $resource->id = $_GET['id'];
        if (!$resource->readOne()) {
            http_response_code(404);
            echo json_encode(["message" => "Ressource non trouvée."]);
            exit();
        }
        echo json_encode([
            "id" => $resource->id,
            "observation_date" => $resource->observation_date,
            "species_type" => $resource->species_type,
            "species_name" => $resource->species_name,
            "description" => $resource->description,
            "location" => $resource->location,
            "trail_id" => $resource->trail_id,
            "author_id" => $resource->author_id,
        ]);
        exit();
    }

    $speciesType = $_GET['species_type'] ?? null;
    if ($speciesType !== null && !in_array($speciesType, ['fauna', 'flora'], true)) {
        http_response_code(400);
        echo json_encode(["message" => "species_type doit être 'fauna' ou 'flora'."]);
        exit();
    }

    $stmt = $resource->readAll($speciesType);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit();
}

$authPayload = JwtMiddleware::authenticate('admin');
$data = json_decode(file_get_contents("php://input"));

if ($method === 'POST') {
    if (!isset($data->species_type) || !isset($data->species_name)) {
        http_response_code(400);
        echo json_encode(["message" => "Type et nom de l'espèce requis."]);
        exit();
    }

    $resource->species_type = $data->species_type;
    $resource->species_name = $data->species_name;
    $resource->description = $data->description ?? null;
    $resource->location = $data->location ?? null;
    $resource->trail_id = $data->trail_id ?? null;
    $resource->author_id = $authPayload['sub'];

    if (!$resource->create()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible d'enregistrer la ressource."]);
        exit();
    }

    http_response_code(201);
    echo json_encode(["status" => "success", "message" => "Ressource enregistrée avec succès.", "id" => $db->lastInsertId()]);
} elseif ($method === 'PUT') {
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Identifiant de la ressource requis."]);
        exit();
    }

    $resource->id = $data->id;
    if (!$resource->readOne()) {
        http_response_code(404);
        echo json_encode(["message" => "Ressource non trouvée."]);
        exit();
    }

    $resource->species_type = $data->species_type ?? $resource->species_type;
    $resource->species_name = $data->species_name ?? $resource->species_name;
    $resource->description = $data->description ?? $resource->description;
    $resource->location = $data->location ?? $resource->location;
    $resource->trail_id = $data->trail_id ?? $resource->trail_id;

    if (!$resource->update()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible de mettre à jour la ressource."]);
        exit();
    }

    echo json_encode(["status" => "success", "message" => "Ressource mise à jour avec succès."]);
} elseif ($method === 'DELETE') {
    if (!isset($data->id)) {
        http_response_code(400);
        echo json_encode(["message" => "Identifiant de la ressource requis."]);
        exit();
    }

    $resource->id = $data->id;
    if (!$resource->delete()) {
        http_response_code(500);
        echo json_encode(["message" => "Impossible de supprimer la ressource."]);
        exit();
    }

    echo json_encode(["status" => "success", "message" => "Ressource supprimée avec succès."]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée."]);
}
