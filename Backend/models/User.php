<?php

class User {
    private $conn;
    private $table_name = "user";

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $password_hash;

    public function __construct($db) {
        $this->conn = $db;
    }

    function create() {
        $query = "INSERT INTO " . $this->table_name . " SET first_name=:first_name, last_name=:last_name, email=:email, password_hash=:password_hash";

        $stmt = $this->conn->prepare($query);

        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password_hash = htmlspecialchars(strip_tags($this->password_hash));

        $stmt->bindParam(":first_name", $this->first_name);
        $stmt->bindParam(":last_name", $this->last_name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password_hash", $this->password_hash);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    function findByEmail() {
        $query = "SELECT id, first_name, last_name, email, password_hash FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        $num = $stmt->rowCount();

        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->email = $row['email'];
            $this->password_hash = $row['password_hash'];

            return true;
        }
        return false;
    }

    public function verifyPassword($password) {
        return password_verify($password, $this->password_hash);
    }
}
