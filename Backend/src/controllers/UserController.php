<?php

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../models/User.php';

class UserController {
    private $conn;
    private $user;

    public function __construct($db) {
        $this->conn = $db;
        $this->user = new User($db);
    }

    public function register($data) {
        if (
            !isset($data->first_name) ||
            !isset($data->last_name) ||
            !isset($data->email) ||
            !isset($data->password)
        ) {
            return ["status" => "error", "message" => "Veuillez remplir tous les champs."];
        }

        $this->user->first_name = $data->first_name;
        $this->user->last_name = $data->last_name;
        $this->user->email = $data->email;
        $this->user->password_hash = password_hash($data->password, PASSWORD_BCRYPT);

        if ($this->user->findByEmail()) {
            return ["status" => "error", "message" => "Cet email est déjà utilisé."];
        }

        if ($this->user->create()) {
            return ["status" => "success", "message" => "Utilisateur créé avec succès."];
        }

        return ["status" => "error", "message" => "Impossible de créer l'utilisateur."];
    }

    public function login($data) {
        if (
            !isset($data->email) ||
            !isset($data->password)
        ) {
            return ["status" => "error", "message" => "Veuillez remplir tous les champs."];
        }

        $this->user->email = $data->email;

        if (!$this->user->findByEmail()) {
            return ["status" => "error", "message" => "Email ou mot de passe incorrect."];
        }

        if ($this->user->verifyPassword($data->password)) {
            // Start session and set user data
            session_start();
            $_SESSION['user_id'] = $this->user->id;
            $_SESSION['user_first_name'] = $this->user->first_name;
            $_SESSION['user_last_name'] = $this->user->last_name;
            $_SESSION['user_email'] = $this->user->email;

            return ["status" => "success", "message" => "Connexion réussie.", "user" => [
                "id" => $this->user->id,
                "first_name" => $this->user->first_name,
                "last_name" => $this->user->last_name,
                "email" => $this->user->email
            ]];
        }

        return ["status" => "error", "message" => "Email ou mot de passe incorrect."];
    }
}
