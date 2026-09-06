<?php

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        // Read from environment variables with defaults for local dev
        $this->host = $_ENV['MYSQL_HOST'] ?? $_SERVER['MYSQL_HOST'] ?? 'localhost';
        $this->port = $_ENV['MYSQL_PORT'] ?? $_SERVER['MYSQL_PORT'] ?? '3306';
        $this->db_name = $_ENV['MYSQL_DATABASE'] ?? $_SERVER['MYSQL_DATABASE'] ?? 'parc_national';
        $this->username = $_ENV['MYSQL_USER'] ?? $_SERVER['MYSQL_USER'] ?? 'root';
        $this->password = $_ENV['MYSQL_PASSWORD'] ?? $_SERVER['MYSQL_PASSWORD'] ?? '';
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

