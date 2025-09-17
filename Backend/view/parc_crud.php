<?php
// parcs_crud.php
header("Content-Type: application/json; charset=UTF-8");

// Connexion MySQL
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "calanques";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connexion échouée : " . $conn->connect_error]));
}

// Lire tous les parcs
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $sql = "SELECT id, nom, description, latitude, longitude FROM parcs";
    $result = $conn->query($sql);

    $parcs = [];
    while ($row = $result->fetch_assoc()) {
        $parcs[] = $row;
    }
    echo json_encode($parcs);
    exit;
}

// Ajouter un parc
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["add"])) {
    $nom = $conn->real_escape_string($_POST["nom"]);
    $desc = $conn->real_escape_string($_POST["description"]);
    $lat = floatval($_POST["latitude"]);
    $lng = floatval($_POST["longitude"]);

    $sql = "INSERT INTO parcs (nom, description, latitude, longitude) 
            VALUES ('$nom', '$desc', $lat, $lng)";
    $conn->query($sql);

    echo json_encode(["success" => true]);
    exit;
}

// Supprimer un parc
if (isset($_GET["delete"])) {
    $id = intval($_GET["delete"]);
    $conn->query("DELETE FROM parcs WHERE id=$id");
    header("Location: index.php");
    exit;
}
?>
