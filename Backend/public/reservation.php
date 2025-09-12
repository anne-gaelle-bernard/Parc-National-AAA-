
<?php
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'cancel') {
	// Annulation de réservation
	$campsite_id = $_POST['campsite_id'] ?? null;
	$personnes = $_POST['personnes'] ?? null;
	if ($campsite_id && $personnes) {
		$stmt = $pdo->prepare('DELETE FROM reservation WHERE campsite_id = ? AND personnes = ? AND status = "confirmed" LIMIT 1');
		$stmt->execute([$campsite_id, $personnes]);
		echo '<div style="margin:40px auto;max-width:500px;background:#ffeaea;padding:20px;border-radius:8px;text-align:center;">';
		echo '<h2>Réservation annulée !</h2>';
		echo '<a href="formulaire_reservation.php">Retour au formulaire</a>';
		echo '</div>';
		exit;
	}
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$camping = $_POST['camping'] ?? '';
	$emplacement = $_POST['emplacement'] ?? '';
	$date_arrivee = $_POST['date_arrivee'] ?? null;
	$date_depart = $_POST['date_depart'] ?? null;
	$personnes = $_POST['personnes'] ?? 1;
	$prix_unitaire = 20.00;
	$prix_total = $prix_unitaire * (int)$personnes;

	// Récupérer l'id du camping
	$stmt = $pdo->prepare('SELECT id FROM camping WHERE name = ?');
	$stmt->execute([$camping]);
	$camping_id = $stmt->fetchColumn();

	// Récupérer l'id et la capacité de l'emplacement
	$stmt = $pdo->prepare('SELECT id, capacity FROM campsite WHERE number = ? AND camping_id = ?');
	$stmt->execute([$emplacement, $camping_id]);
	$campsite = $stmt->fetch(PDO::FETCH_ASSOC);
	$campsite_id = $campsite['id'] ?? null;
	$capacity = $campsite['capacity'] ?? 0;

	// Vérifier le nombre de personnes déjà réservées pour cet emplacement
	$stmt = $pdo->prepare('SELECT SUM(personnes) as total FROM reservation WHERE campsite_id = ?');
	$stmt->execute([$campsite_id]);
	$total_reserves = (int)$stmt->fetchColumn();

	$max_personnes = 10;
	if (($total_reserves + (int)$personnes) > $capacity || ($total_reserves + (int)$personnes) > $max_personnes) {
		echo '<div style="margin:40px auto;max-width:500px;background:#ffeaea;padding:20px;border-radius:8px;text-align:center;">';
		echo '<h2>Réservation impossible</h2>';
		echo '<p>Il n\'y a plus assez de places disponibles pour cet emplacement (maximum 10 personnes).</p>';
		echo '<a href="formulaire_reservation.php">Retour au formulaire</a>';
		echo '</div>';
		exit;
	}

	// Insérer la réservation avec les dates
	$stmt = $pdo->prepare('INSERT INTO reservation (campsite_id, status, personnes, reservation_date, date_arrivee, date_depart) VALUES (?, "confirmed", ?, NOW(), ?, ?)');
	$stmt->execute([$campsite_id, $personnes, $date_arrivee, $date_depart]);

	echo '<div style="margin:40px auto;max-width:500px;background:#eafbe7;padding:20px;border-radius:8px;text-align:center;">';
	echo '<h2>Réservation enregistrée !</h2>';
	echo '<p>Camping : '.htmlspecialchars($camping).'</p>';
	echo '<p>Emplacement : '.htmlspecialchars($emplacement).'</p>';
	echo '<p>Date d\'arrivée : '.htmlspecialchars($date_arrivee).'</p>';
	echo '<p>Date de départ : '.htmlspecialchars($date_depart).'</p>';
	echo '<p>Nombre de personnes : '.htmlspecialchars($personnes).'</p>';
	echo '<p>Prix total : '.number_format($prix_total, 2, ',', ' ').' € c</p>';
	echo '<form method="post" action="reservation.php" style="margin-top:20px;">';
	echo '<input type="hidden" name="action" value="cancel">';
	echo '<input type="hidden" name="campsite_id" value="'.htmlspecialchars($campsite_id).'">';
	echo '<input type="hidden" name="personnes" value="'.htmlspecialchars($personnes).'">';
	echo '<button type="submit" style="background:#c0392b;color:#fff;padding:10px 20px;border:none;border-radius:4px;cursor:pointer;">Annuler la réservation</button>';
	echo '</form>';
	echo '<a href="formulaire_reservation.php" style="display:block;margin-top:20px;">Retour au formulaire</a>';
	echo '</div>';
	exit;
}
// Si accès direct, rediriger vers le formulaire
header('Location: formulaire_reservation.php');
exit;

