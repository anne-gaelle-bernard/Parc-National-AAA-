<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/Camping.php';
require_once __DIR__ . '/../../models/Campsite.php';
require_once __DIR__ . '/../../models/Reservation.php';

class CampingController {
    private $conn;
    private $camping;
    private $campsite;
    private $reservation;

    public function __construct($db) {
        $this->conn = $db;
        $this->camping = new Camping($db);
        $this->campsite = new Campsite($db);
        $this->reservation = new Reservation($db);
    }

    public function getAllCampings() {
        $stmt = $this->camping->readAll();
        $num = $stmt->rowCount();

        $campings_arr = [];

        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $camping_item = [
                    "id" => $id,
                    "name" => $name,
                    "location" => $location,
                    "description" => $description,
                    "campsites" => []
                ];

                // Get campsites for this camping
                $campsite_stmt = $this->campsite->readByCampingId($id);
                $campsite_num = $campsite_stmt->rowCount();

                if($campsite_num > 0) {
                    while ($campsite_row = $campsite_stmt->fetch(PDO::FETCH_ASSOC)) {
                        extract($campsite_row);
                        $camping_item['campsites'][] = [
                            "id" => $id,
                            "number" => $number,
                            "max_capacity" => $max_capacity,
                            "price_per_night" => $price_per_night
                        ];
                    }
                }
                array_push($campings_arr, $camping_item);
            }

            return ["status" => "success", "data" => $campings_arr];
        }

        return ["status" => "error", "message" => "Aucun camping trouvé."];
    }

    public function createReservation($data) {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            return ["status" => "error", "message" => "Veuillez vous connecter pour faire une réservation."];
        }

        if (
            !isset($data->campsite_id) ||
            !isset($data->check_in_date) ||
            !isset($data->check_out_date)
        ) {
            return ["status" => "error", "message" => "Veuillez fournir toutes les informations de réservation (emplacement, dates d'arrivée et de départ)."];
        }

        // Get campsite details to calculate price
        $campsite_stmt = $this->campsite->readByCampsiteId($data->campsite_id);
        $campsite_row = $campsite_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$campsite_row) {
            return ["status" => "error", "message" => "Emplacement de camping non trouvé."];
        }

        $price_per_night = $campsite_row['price_per_night'];

        // Calculate total price
        $check_in = new DateTime($data->check_in_date);
        $check_out = new DateTime($data->check_out_date);

        if ($check_in >= $check_out) {
            return ["status" => "error", "message" => "La date de départ doit être après la date d'arrivée."];
        }

        $interval = $check_in->diff($check_out);
        $number_of_nights = $interval->days;
        $total_price = $number_of_nights * $price_per_night;

        $this->reservation->user_id = $_SESSION['user_id'];
        $this->reservation->campsite_id = $data->campsite_id;
        $this->reservation->check_in_date = $data->check_in_date;
        $this->reservation->check_out_date = $data->check_out_date;
        $this->reservation->status = "confirmed"; // Default status
        $this->reservation->total_price = $total_price;

        if ($this->reservation->create()) {
            return ["status" => "success", "message" => "Réservation créée avec succès.", "total_price" => $total_price];
        }

        return ["status" => "error", "message" => "Impossible de créer la réservation."];
    }
}
