<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Auth is stateless (JWT in localStorage) — there is no server-side
// session to destroy, so logging out is just telling the client to
// discard its token.
echo json_encode(["status" => "success", "message" => "Déconnexion réussie."]);
