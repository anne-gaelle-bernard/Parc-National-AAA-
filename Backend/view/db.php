<?php
$host     = getenv('MYSQLHOST') ?: (getenv('DB_HOST') ?: 'localhost');
$port     = getenv('MYSQLPORT') ?: (getenv('DB_PORT') ?: '3306');
$db_name  = getenv('MYSQLDATABASE') ?: (getenv('DB_NAME') ?: 'parc_national');
$username = getenv('MYSQLUSER') ?: (getenv('DB_USER') ?: 'root');
$password = getenv('MYSQLPASSWORD') ?: (getenv('DB_PASSWORD') ?: '');

$dsn = "mysql:host=$host;port=$port;dbname=$db_name;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("❌ Connexion échouée : " . $e->getMessage());
}
?>
