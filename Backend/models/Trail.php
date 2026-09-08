<?php

class Trail {
    private $conn;
    private $table_name = "trail";

    public $id;
    public $name;
    public $difficulty; // easy | medium | hard
    public $estimated_duration; // HH:MM:SS
    public $description;
    public $map_url;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT id, name, difficulty, estimated_duration, description, map_url FROM " . $this->table_name . " ORDER BY name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT id, name, difficulty, estimated_duration, description, map_url FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return false;
        }

        $this->name = $row['name'];
        $this->difficulty = $row['difficulty'];
        $this->estimated_duration = $row['estimated_duration'];
        $this->description = $row['description'];
        $this->map_url = $row['map_url'];
        return true;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, difficulty=:difficulty, estimated_duration=:estimated_duration, description=:description, map_url=:map_url";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->difficulty = htmlspecialchars(strip_tags($this->difficulty));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->map_url = htmlspecialchars(strip_tags($this->map_url));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':difficulty', $this->difficulty);
        $stmt->bindParam(':estimated_duration', $this->estimated_duration);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':map_url', $this->map_url);

        return $stmt->execute();
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " SET name=:name, difficulty=:difficulty, estimated_duration=:estimated_duration, description=:description, map_url=:map_url WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->difficulty = htmlspecialchars(strip_tags($this->difficulty));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->map_url = htmlspecialchars(strip_tags($this->map_url));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':difficulty', $this->difficulty);
        $stmt->bindParam(':estimated_duration', $this->estimated_duration);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':map_url', $this->map_url);
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    public function readPointsOfInterest($trailId) {
        $query = "SELECT id, name, description, gps_coordinates FROM point_of_interest WHERE trail_id = ? ORDER BY id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $trailId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function replacePointsOfInterest($trailId, array $pointsOfInterest) {
        $deleteStmt = $this->conn->prepare("DELETE FROM point_of_interest WHERE trail_id = ?");
        $deleteStmt->bindParam(1, $trailId);
        $deleteStmt->execute();

        $insertStmt = $this->conn->prepare(
            "INSERT INTO point_of_interest (name, description, gps_coordinates, trail_id) VALUES (:name, :description, :gps_coordinates, :trail_id)"
        );

        foreach ($pointsOfInterest as $poi) {
            $name = htmlspecialchars(strip_tags($poi->name ?? ''));
            $description = htmlspecialchars(strip_tags($poi->description ?? ''));
            $gps = htmlspecialchars(strip_tags($poi->gps_coordinates ?? ''));

            $insertStmt->bindParam(':name', $name);
            $insertStmt->bindParam(':description', $description);
            $insertStmt->bindParam(':gps_coordinates', $gps);
            $insertStmt->bindParam(':trail_id', $trailId);
            $insertStmt->execute();
        }
    }
}
