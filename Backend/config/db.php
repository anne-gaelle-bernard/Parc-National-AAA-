<?php
function getDbConnection() {
	$host = 'localhost';
	$user = 'root';
	$pass = '';
	$dbname = 'parc_national';

	$conn = new mysqli($host, $user, $pass, $dbname);
	if ($conn->connect_error) {
		die('Erreur de connexion à la base de données: ' . $conn->connect_error);
	}
	return $conn;
}
?>
