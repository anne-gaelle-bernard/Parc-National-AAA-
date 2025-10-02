<?php
$dsn = 'mysql:host=localhost;dbname=parc_national;charset=utf8mb4';
$username = 'root';  
$password = '';       

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
     header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        "status" => "error",
        "message" => "Connexion échouée : " . $e->getMessage()
    ]);
    exit;
}
?>
