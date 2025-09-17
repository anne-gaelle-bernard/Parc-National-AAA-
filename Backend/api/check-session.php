<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

session_start();

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "first_name" => $_SESSION['user_first_name'],
            "last_name" => $_SESSION['user_last_name'],
            "email" => $_SESSION['user_email']
        ]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
