<?php
/**
 * Database initialization script for Railway deployment
 * Runs migrations and seeds the database with initial data
 */

// Read environment variables
$host = $_ENV['MYSQL_HOST'] ?? $_SERVER['MYSQL_HOST'] ?? 'localhost';
$port = $_ENV['MYSQL_PORT'] ?? $_SERVER['MYSQL_PORT'] ?? '3306';
$db_name = $_ENV['MYSQL_DATABASE'] ?? $_SERVER['MYSQL_DATABASE'] ?? 'parc_national';
$username = $_ENV['MYSQL_USER'] ?? $_SERVER['MYSQL_USER'] ?? 'root';
$password = $_ENV['MYSQL_PASSWORD'] ?? $_SERVER['MYSQL_PASSWORD'] ?? '';

echo "[DB Init] Connecting to MySQL...\n";

try {
    // Connect to MySQL without selecting a database first
    $dsn = "mysql:host=" . $host . ";port=" . $port;
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    echo "[DB Init] Creating database if not exists...\n";
    $conn->exec("CREATE DATABASE IF NOT EXISTS `" . $db_name . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci");
    
    // Switch to the database
    $conn->exec("USE `" . $db_name . "`");
    echo "[DB Init] Database selected.\n";
    
    // Read and execute the SQL schema
    $sql_file = __DIR__ . '/parc_national.sql';
    if (!file_exists($sql_file)) {
        throw new Exception("SQL file not found: " . $sql_file);
    }
    
    echo "[DB Init] Loading schema from " . $sql_file . "...\n";
    $sql_content = file_get_contents($sql_file);
    
    // Split and execute statements
    $statements = array_filter(
        array_map('trim', explode(';', $sql_content)),
        fn($s) => !empty($s) && !str_starts_with($s, '--')
    );
    
    foreach ($statements as $statement) {
        if (!empty(trim($statement))) {
            $conn->exec($statement);
        }
    }
    
    echo "[DB Init] Schema loaded successfully.\n";
    echo "[DB Init] Database initialization complete!\n";
    
} catch(PDOException $e) {
    echo "[DB Init Error] PDO Error: " . $e->getMessage() . "\n";
    exit(1);
} catch(Exception $e) {
    echo "[DB Init Error] " . $e->getMessage() . "\n";
    exit(1);
}

