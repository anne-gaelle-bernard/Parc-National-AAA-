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

    public function getUserProfile($userId) {
        $this->user->id = $userId;
        $this->user->readOne();

        if ($this->user->first_name) {
            return [
                "id" => $this->user->id,
                "first_name" => $this->user->first_name,
                "last_name" => $this->user->last_name,
                "email" => $this->user->email,
                "role" => $this->user->role // Assurez-vous que le rôle est également chargé
            ];
        }
        return null;
    }

    public function updateUserProfile($userId, $data) {
        $this->user->id = $userId;
        $this->user->readOne(); // Charger l'utilisateur existant

        if (!$this->user->first_name) {
            return false; // Utilisateur non trouvé
        }

        // Mettre à jour les propriétés de l'utilisateur avec les nouvelles données
        $this->user->first_name = $data->first_name;
        $this->user->last_name = $data->last_name;
        $this->user->email = $data->email;
        // Le rôle n'est pas modifiable via le profil utilisateur, mais peut être inclus si nécessaire

        return $this->user->update();
    }

    public function changeUserPassword($userId, $currentPassword, $newPassword) {
        $this->user->id = $userId;
        $this->user->readOne();

        if (!$this->user->first_name) {
            return ["success" => false, "message" => "Utilisateur non trouvé."];
        }

        if (!$this->user->verifyPassword($currentPassword)) {
            return ["success" => false, "message" => "Mot de passe actuel incorrect."];
        }

        $this->user->password_hash = password_hash($newPassword, PASSWORD_BCRYPT);
        if ($this->user->updatePassword()) {
            return ["success" => true, "message" => "Mot de passe mis à jour avec succès."];
        }
        return ["success" => false, "message" => "Impossible de mettre à jour le mot de passe."];
    }
}
