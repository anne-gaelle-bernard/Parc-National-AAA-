<?php
session_start();
require 'db.php';

// Vérification : connecté et rôle visitor
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'visitor') {
    header("Location: login.php");
    exit();
}

// Récupération des infos utilisateur
$stmt = $pdo->prepare("SELECT first_name, last_name, email FROM user WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    echo "❌ Utilisateur introuvable.";
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Profil Visiteur</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            font-family: 'Cousine', monospace;
            background: #f9f9f9;
            margin: 0;
        }
        .profile-container {
            max-width: 500px;
            margin: 50px auto;
            background: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            background: #2d6a4f;
            color: #fff;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #1b4332;
        }
    </style>
</head>
<body>
    <div class="profile-container">
        <h2>👤 Mon Profil</h2>
        <p><strong>Prénom :</strong> <?= htmlspecialchars($user['first_name']) ?></p>
        <p><strong>Nom :</strong> <?= htmlspecialchars($user['last_name']) ?></p>
        <p><strong>Email :</strong> <?= htmlspecialchars($user['email']) ?></p>
        <p><strong>Rôle :</strong> <?= htmlspecialchars($_SESSION['role']) ?></p>

        <a href="sentiers.php" class="btn">Voir les sentiers</a>
        <a href="logout.php" class="btn">Se déconnecter</a>
    </div>
</body>
</html>
