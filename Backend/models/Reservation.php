<?php

class Reservation {
    private $conn;
    private $table_name = "reservation";

    public $id;
    public $user_id;
    public $campsite_id;
    public $check_in_date;
    public $check_out_date;
    public $status;
    public $total_price;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET user_id=:user_id, campsite_id=:campsite_id, check_in_date=:check_in_date, check_out_date=:check_out_date, status=:status, total_price=:total_price";

        $stmt = $this->conn->prepare($query);

        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->campsite_id = htmlspecialchars(strip_tags($this->campsite_id));
        $this->check_in_date = htmlspecialchars(strip_tags($this->check_in_date));
        $this->check_out_date = htmlspecialchars(strip_tags($this->check_out_date));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->total_price = htmlspecialchars(strip_tags($this->total_price));

        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":campsite_id", $this->campsite_id);
        $stmt->bindParam(":check_in_date", $this->check_in_date);
        $stmt->bindParam(":check_out_date", $this->check_out_date);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":total_price", $this->total_price);

        if($stmt->execute()) {
            return true;
        }

        return false;
    }
}
