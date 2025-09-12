<?php
// formulaire_reservation.php
require_once '../config/db.php'; // Inclure la connexion PDO

// Fonction pour nettoyer les chaînes
function sanitize_string($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Récupérer et nettoyer le camping depuis GET
$camping = sanitize_string(filter_input(INPUT_GET, 'camping', FILTER_UNSAFE_RAW) ?? '');

// Rediriger vers choix_camping.php si aucun camping n'est spécifié
if (empty($camping)) {
    header('Location: choix_camping.php');
    exit;
}

// Vérifier si le camping existe dans la base
try {
    $stmt = $pdo->prepare('SELECT id FROM camping WHERE name = ?');
    $stmt->execute([$camping]);
    $camping_id = $stmt->fetchColumn();
    if (!$camping_id) {
        header('Location: choix_camping.php'); // Camping invalide, rediriger
        exit;
    }
} catch (PDOException $e) {
    die('Erreur de récupération des données : ' . $e->getMessage());
}

// Récupérer les informations sur les emplacements pour le camping sélectionné
$places = [];
try {
    // Initialiser les places restantes (capacité max = 10 par emplacement)
    for ($i = 1; $i <= 5; $i++) {
        $stmt = $pdo->prepare('SELECT id, capacity FROM campsite WHERE number = ? AND camping_id = ?');
        $stmt->execute([(string)$i, $camping_id]);
        $campsite = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($campsite) {
            // Calculer les personnes réservées pour cet emplacement
            $stmt = $pdo->prepare('SELECT SUM(personnes) as total FROM reservation WHERE campsite_id = ? AND status = "confirmed"');
            $stmt->execute([$campsite['id']]);
            $total_reserves = (int)$stmt->fetchColumn();
            $places[$i] = max(0, $campsite['capacity'] - $total_reserves);
        } else {
            $places[$i] = 0; // Emplacement non trouvé
        }
    }
} catch (PDOException $e) {
    die('Erreur de récupération des données : ' . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réservation Camping</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; }
        .container { max-width: 500px; margin: 40px auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px #ccc; }
        label { display: block; margin-top: 15px; }
        select, input[type="number"], input[type="date"] { width: 100%; padding: 8px; margin-top: 5px; }
        .prix { margin: 15px 0; font-weight: bold; color: #2c3e50; }
        button[type="submit"] { background: #27ae60; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 20px; }
        button[type="submit"]:hover { background: #219150; }
        .back-link { display: block; margin-bottom: 20px; color: #2980b9; text-decoration: none; }
    </style>
</head>
<body>
<div class="container">
    <a class="back-link" href="choix_camping.php">&larr; Retour au choix du camping</a>
    <h3>Réserver à <?php echo htmlspecialchars($camping); ?></h3>
    <form method="post" action="reservation.php">
        <input type="hidden" name="camping" value="<?php echo htmlspecialchars($camping); ?>">
        <label for="emplacement">Choisissez l'emplacement :</label>
        <select name="emplacement" id="emplacement" required>
            <?php for ($i = 1; $i <= 5; $i++): ?>
                <option value="<?php echo $i; ?>" <?php echo (isset($places[$i]) && $places[$i] == 0) ? 'disabled' : ''; ?>>
                    Emplacement <?php echo $i; ?> (<?php echo $places[$i] ?? '0'; ?> places restantes)
                    <?php if (isset($places[$i]) && $places[$i] == 0) echo ' - complet'; ?>
                </option>
            <?php endfor; ?>
        </select>

        <label for="date_arrivee">Date d'arrivée :</label>
        <input type="date" name="date_arrivee" id="date_arrivee" required>

        <label for="date_depart">Date de départ :</label>
        <input type="date" name="date_depart" id="date_depart" required>

        <label for="personnes">Nombre de personnes :</label>
        <input type="number" name="personnes" id="personnes" min="1" max="10" value="1" required>

        <label for="user_id">ID Utilisateur :</label>
        <input type="number" name="user_id" id="user_id" value="1" required>

        <div class="prix">Prix : 20 € / nuit / personne</div>

        <button type="submit">Réserver</button>
    </form>
</div>
</body>
</html>