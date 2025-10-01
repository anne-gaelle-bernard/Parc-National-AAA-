<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/db.php';

class ReservationAPI {
    private $conn;

    public function __construct() {
$database = new Database();
        $this->conn = $database->getConnection();
    }

    public function createReservation($data) {
        // Validate input
        if (
            !isset($data->user_id) ||
            !isset($data->campsite_id) ||
            !isset($data->check_in_date) ||
            !isset($data->check_out_date) ||
            !isset($data->number_of_persons)
        ) {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create reservation. Missing data."));
            return;
        }

        $userId = $data->user_id;
        $campsiteId = $data->campsite_id;
        $checkInDate = $data->check_in_date;
        $checkOutDate = $data->check_out_date;
        $numberOfPersons = $data->number_of_persons;

        // Get campsite details to validate capacity and get price
        $queryCampsite = "SELECT max_capacity, price_per_night FROM campsite WHERE id = ? LIMIT 0,1";
        $stmtCampsite = $this->conn->prepare($queryCampsite);
        $stmtCampsite->bindParam(1, $campsiteId);
        $stmtCampsite->execute();
        $campsite = $stmtCampsite->fetch(PDO::FETCH_ASSOC);

        if (!$campsite) {
            http_response_code(404);
            echo json_encode(array("message" => "Campsite not found."));
            return;
        }

        if ($numberOfPersons > $campsite['max_capacity']) {
            http_response_code(400);
            echo json_encode(array("message" => "Number of persons exceeds campsite capacity."));
            return;
        }

        // Calculate total price (always recalculate on backend for security)
        $startDate = new DateTime($checkInDate);
        $endDate = new DateTime($checkOutDate);
        $interval = $startDate->diff($endDate);
        $numberOfNights = $interval->days;

        if ($numberOfNights <= 0) {
            http_response_code(400);
            echo json_encode(array("message" => "Check-out date must be after check-in date."));
            return;
        }

        $totalPrice = $numberOfNights * $campsite['price_per_night'] * $numberOfPersons;

        // Check for availability
        $queryAvailability = "
            SELECT COUNT(*)
            FROM reservation
            WHERE
                campsite_id = ? AND
                ((check_in_date <= ? AND check_out_date > ?) OR
                 (check_in_date < ? AND check_out_date >= ?) OR
                 (? < check_out_date AND ? > check_in_date))
        ";
        $stmtAvailability = $this->conn->prepare($queryAvailability);
        $stmtAvailability->bindParam(1, $campsiteId);
        $stmtAvailability->bindParam(2, $checkOutDate);
        $stmtAvailability->bindParam(3, $checkInDate);
        $stmtAvailability->bindParam(4, $checkOutDate);
        $stmtAvailability->bindParam(5, $checkInDate);
        $stmtAvailability->bindParam(6, $checkInDate);
        $stmtAvailability->bindParam(7, $checkOutDate);
        $stmtAvailability->execute();
        $overlappingReservations = $stmtAvailability->fetchColumn();

        if ($overlappingReservations > 0) {
            http_response_code(409); // Conflict
            echo json_encode(array("message" => "Campsite is not available for the selected dates."));
            return;
        }

        // Create reservation
        $query = "INSERT INTO reservation (user_id, campsite_id, check_in_date, check_out_date, number_of_persons, total_price) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(1, $userId);
        $stmt->bindParam(2, $campsiteId);
        $stmt->bindParam(3, $checkInDate);
        $stmt->bindParam(4, $checkOutDate);
        $stmt->bindParam(5, $numberOfPersons);
        $stmt->bindParam(6, $totalPrice);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("status" => "success", "message" => "Reservation created successfully.", "reservation_id" => $this->conn->lastInsertId(), "total_price" => $totalPrice));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to create reservation."));
        }
    }

    public function cancelReservation($reservationId) {
        $query = "UPDATE reservation SET status = 'cancelled' WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $reservationId);

        if ($stmt->execute()) {
            if ($stmt->rowCount() > 0) {
http_response_code(200);
                echo json_encode(array("message" => "Reservation cancelled successfully."));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Reservation not found or already cancelled."));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Unable to cancel reservation."));
        }
    }

    public function getUserReservations($userId) {
        $query = "
            SELECT 
                r.id as reservation_id,
                r.check_in_date,
                r.check_out_date,
                r.total_price,
                r.status,
                c.name as camping_name,
                s.number as campsite_number
            FROM 
                reservation r
            JOIN 
                campsite s ON r.campsite_id = s.id
            JOIN 
                camping c ON s.camping_id = c.id
            WHERE 
                r.user_id = ?
            ORDER BY 
                r.check_in_date DESC
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $userId);
        $stmt->execute();
        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reservations);
    }
}

$api = new ReservationAPI();

// Handle POST request for creating a reservation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $api->createReservation($data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->reservation_id)) {
        $api->cancelReservation($data->reservation_id);
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing reservation_id for cancellation."));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['user_id'])) {
    $api->getUserReservations($_GET['user_id']);
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("message" => "Method not allowed."));
}

?>
