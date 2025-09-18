<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db.php';

class CampingAPI {
    private $conn;

    public function __construct() {
$database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAllCampings() {
        $query = "SELECT id, name, location, description FROM camping";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $campings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($campings);
    }

    public function getCampingDetails($id) {
        $query = "
            SELECT 
                c.id as camping_id, 
                c.name as camping_name, 
                c.location, 
                c.description,
                s.id as campsite_id,
                s.number as campsite_number,
                s.max_capacity,
                s.price_per_night
            FROM 
                camping c
            LEFT JOIN 
                campsite s ON c.id = s.camping_id
            WHERE 
                c.id = ?
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($results)) {
            http_response_code(404);
            echo json_encode(array("message" => "Camping not found."));
            return;
        }

        $camping = [
            "id" => $results[0]['camping_id'],
            "name" => $results[0]['camping_name'],
            "location" => $results[0]['location'],
            "description" => $results[0]['description'],
            "campsites" => []
        ];

        foreach ($results as $row) {
            if ($row['campsite_id']) {
                $camping['campsites'][] = [
                    "id" => $row['campsite_id'],
                    "number" => $row['campsite_number'],
                    "max_capacity" => $row['max_capacity'],
                    "price_per_night" => $row['price_per_night']
                ];
            }
        }
        echo json_encode($camping);
    }
}

$api = new CampingAPI();

if (isset($_GET['id'])) {
    $api->getCampingDetails($_GET['id']);
} else {
    $api->getAllCampings();
}
?>
