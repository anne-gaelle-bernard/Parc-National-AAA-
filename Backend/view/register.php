<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);

    // Vérification si l'email correspond à l'admin
    if (str_ends_with($email, '@parcnational.com')) {
        $role = 'admin';
    } else {
        $role = 'visitor';
    }

    $stmt = $pdo->prepare("INSERT INTO user (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)");
    try {
        $stmt->execute([$email, $password, $first_name, $last_name, $role]);
        // Redirection vers la page de login après inscription
        header("Location: login.php");
        exit();
    } catch (PDOException $e) {
        echo "❌ Erreur : " . $e->getMessage();
    }
}
?>

<form method="POST">
    <h2>Créer un compte</h2>
    <input type="text" name="first_name" placeholder="Prénom" required><br>
    <input type="text" name="last_name" placeholder="Nom" required><br>
    <input type="email" name="email" placeholder="Email" required><br>
    <input type="password" name="password" placeholder="Mot de passe" required><br>
    <button type="submit">S'inscrire</button>
</form>

