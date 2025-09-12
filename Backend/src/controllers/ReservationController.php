<?php
require_once __DIR__ . '/../../models/Reservation.php';
require_once __DIR__ . '/../../config/db.php';

class ReservationController {
	private $pdo;
	public function __construct($pdo) { $this->pdo = $pdo; }

	public function getPlaces($camping, $emplacement) {
		$reservation = new Reservation($this->pdo);
		return $reservation->getPlacesRestantes($camping, $emplacement);
	}

	public function reserver($data) {
		$reservation = new Reservation($this->pdo);
		return $reservation->create($data);
	}
}

