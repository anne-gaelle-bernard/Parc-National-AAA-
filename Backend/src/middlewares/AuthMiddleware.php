<?php

/**
 * Session-based auth guard, kept for endpoints that still rely on the
 * PHP session set at login (see UserController::login). New endpoints
 * should prefer JwtMiddleware.
 */
class AuthMiddleware {
    /**
     * Ensures a logged-in session exists. Sends a 401 JSON response and
     * exits if not. Returns the authenticated user id otherwise.
     */
    public static function requireLogin() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["message" => "Non autorisé."]);
            exit();
        }

        return $_SESSION['user_id'];
    }
}
