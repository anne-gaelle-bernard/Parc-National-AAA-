<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT id, password_hash, role, first_name, last_name FROM user WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Stocker les infos en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];

        echo "✅ Connexion réussie !";

        // Redirection selon le rôle
        if ($user['role'] === 'admin') {
            header("Location: admin.php");
        } else {
            header("Location: visitor.php");
        }
        exit;
    } else {
        echo "❌ Email ou mot de passe incorrect.";
    }
}
?>

<form method="POST">
    <h2>Se connecter</h2>
    <input type="email" name="email" placeholder="Email" required><br>
    <input type="password" name="password" placeholder="Mot de passe" required><br>
    <button type="submit">Connexion</button>
</form>
