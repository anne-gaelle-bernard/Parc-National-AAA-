<?php

class Camping {
    private $conn;
    private $table_name = "camping";

    public $id;
    public $name;
    public $location;
    public $description;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT id, name, location, description FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
