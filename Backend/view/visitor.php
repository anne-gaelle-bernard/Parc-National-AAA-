<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'visitor') {
    header("Location: login.php");
    exit;
}
echo "<h1>Bienvenue Visiteur, " . htmlspecialchars($_SESSION['first_name']) . "</h1>";
?>
<a href="logout.php">Se déconnecter</a>