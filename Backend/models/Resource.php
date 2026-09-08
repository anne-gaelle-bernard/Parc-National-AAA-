<?php

class Resource {
    private $conn;
    private $table_name = "resource";

    public $id;
    public $observation_date;
    public $species_type; // fauna | flora
    public $species_name;
    public $description;
    public $location;
    public $trail_id;
    public $author_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll($speciesType = null) {
        $query = "SELECT id, observation_date, species_type, species_name, description, location, trail_id, author_id FROM " . $this->table_name;
        if ($speciesType) {
            $query .= " WHERE species_type = :species_type";
        }
        $query .= " ORDER BY observation_date DESC";

        $stmt = $this->conn->prepare($query);
        if ($speciesType) {
            $stmt->bindParam(':species_type', $speciesType);
        }
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT id, observation_date, species_type, species_name, description, location, trail_id, author_id FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return false;
        }

        $this->observation_date = $row['observation_date'];
        $this->species_type = $row['species_type'];
        $this->species_name = $row['species_name'];
        $this->description = $row['description'];
        $this->location = $row['location'];
        $this->trail_id = $row['trail_id'];
        $this->author_id = $row['author_id'];
        return true;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " SET species_type=:species_type, species_name=:species_name, description=:description, location=:location, trail_id=:trail_id, author_id=:author_id";
        $stmt = $this->conn->prepare($query);

        $this->species_type = htmlspecialchars(strip_tags($this->species_type));
        $this->species_name = htmlspecialchars(strip_tags($this->species_name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));

        $stmt->bindParam(':species_type', $this->species_type);
        $stmt->bindParam(':species_name', $this->species_name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':trail_id', $this->trail_id);
        $stmt->bindParam(':author_id', $this->author_id);

        return $stmt->execute();
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . " SET species_type=:species_type, species_name=:species_name, description=:description, location=:location, trail_id=:trail_id WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->species_type = htmlspecialchars(strip_tags($this->species_type));
        $this->species_name = htmlspecialchars(strip_tags($this->species_name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));

        $stmt->bindParam(':species_type', $this->species_type);
        $stmt->bindParam(':species_name', $this->species_name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':trail_id', $this->trail_id);
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        return $stmt->execute();
    }

    /** Simple counts report: number of observations per species_type / species_name. */
    public function report() {
        $query = "
            SELECT species_type, species_name, COUNT(*) as observation_count, MAX(observation_date) as last_observed
            FROM " . $this->table_name . "
            GROUP BY species_type, species_name
            ORDER BY species_type ASC, observation_count DESC
        ";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
