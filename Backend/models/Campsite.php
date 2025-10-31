<?php

class Campsite {
    private $conn;
    private $table_name = "campsite";

    public $id;
    public $number;
    public $max_capacity;
    public $price_per_night;
    public $camping_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readByCampingId($camping_id) {
        $query = "SELECT id, number, max_capacity, price_per_night FROM " . $this->table_name . " WHERE camping_id = ? ORDER BY number ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $camping_id);
        $stmt->execute();
        return $stmt;
    }

    public function readByCampsiteId($campsite_id) {
        $query = "SELECT id, number, max_capacity, price_per_night, camping_id FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $campsite_id);
        $stmt->execute();
        return $stmt;
    }
}
