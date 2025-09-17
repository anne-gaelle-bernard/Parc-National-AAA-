<?php
$pdo = new PDO("mysql:host=localhost;dbname=calanques;charset=utf8", "root", "");

// Ajouter un sentier
if (isset($_POST['add'])) {
  $stmt = $pdo->prepare("INSERT INTO sentiers (nom, description, latitude, longitude) VALUES (?, ?, ?, ?)");
  $stmt->execute([$_POST['nom'], $_POST['description'], $_POST['latitude'], $_POST['longitude']]);
  header("Location: map.php");
  exit;
}

// Supprimer un sentier
if (isset($_GET['delete'])) {
  $stmt = $pdo->prepare("DELETE FROM sentiers WHERE id = ?");
  $stmt->execute([$_GET['delete']]);
  header("Location: map.php");
  exit;
}
?>
