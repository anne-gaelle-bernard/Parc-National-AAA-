<?php
header('Content-Type: application/json, charset=utf-8');
session_start();
session_destroy();

echo json_encode(["status" => "success", "message" => "Déconnexion réussie."]);
?>