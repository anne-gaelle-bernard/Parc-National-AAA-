<?php
header('Content-Type: application/json, charset=utf-8');
session_start();


if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => [
            "first_name" => $_SESSION['first_name'],
            "last_name" => $_SESSION['last_name'],
            "role" => $_SESSION['role']
        ]
    ]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>