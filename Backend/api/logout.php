<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['user_id'])) {
    session_unset();
    session_destroy();
    echo json_encode(["status" => "success", "message" => "Déconnexion réussie."]);
} else {
    echo json_encode(["status" => "error", "message" => "Aucune session active."]);
}
