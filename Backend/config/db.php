<?php

class Database {
    private $host;
    private $port;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // Reads standard Railway MySQL plugin variable names first
        // (MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD),
        // falling back to generic DB_* names, then to local dev defaults
        // so nothing changes for a local XAMPP/PHP built-in server setup.
        $this->host     = getenv('MYSQLHOST') ?: (getenv('DB_HOST') ?: 'localhost');
        $this->port     = getenv('MYSQLPORT') ?: (getenv('DB_PORT') ?: '3306');
        $this->db_name  = getenv('MYSQLDATABASE') ?: (getenv('DB_NAME') ?: 'parc_national');
        $this->username = getenv('MYSQLUSER') ?: (getenv('DB_USER') ?: 'root');
        $this->password = getenv('MYSQLPASSWORD') ?: (getenv('DB_PASSWORD') ?: '');
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
