<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$user = $_SESSION['user'];
?>

<h2>Bienvenue <?php echo htmlspecialchars($user['first_name'] . " " . $user['last_name']); ?> 🎉</h2>
<p>Rôle : <?php echo htmlspecialchars($user['role']); ?></p>
<a href="logout.php">Se déconnecter</a>
