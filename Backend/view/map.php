<?php
// Connexion BDD
$pdo = new PDO("mysql:host=localhost;dbname=calanques;charset=utf8", "root", "");

// Récupération des sentiers
$stmt = $pdo->query("SELECT * FROM sentiers");
$sentiers = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Carte - Calanques</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <style>
    #map { height: 600px; }
    .form { margin-top: 20px; }
  </style>
</head>
<body>
  <h1>Carte des Sentiers - Calanques de Marseille</h1>
  <div id="map"></div>

  <div class="form">
    <h2>Ajouter un sentier</h2>
    <form method="POST" action="sentiers_crud.php">
      <input type="text" name="nom" placeholder="Nom du sentier" required>
      <textarea name="description" placeholder="Description"></textarea>
      <input type="text" name="latitude" placeholder="Latitude" required>
      <input type="text" name="longitude" placeholder="Longitude" required>
      <button type="submit" name="add">Ajouter</button>
    </form>
  </div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    var map = L.map('map').setView([43.214, 5.433], 12); // Coordonnées des Calanques

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    var sentiers = <?php echo json_encode($sentiers); ?>;

    sentiers.forEach(s => {
      L.marker([s.latitude, s.longitude])
        .addTo(map)
        .bindPopup("<b>" + s.nom + "</b><br>" + s.description +
                   "<br><a href='sentiers_crud.php?delete=" + s.id + "'>Supprimer</a>");
    });

    // Ajout d’un point par clic
    map.on('click', function(e) {
      var lat = e.latlng.lat;
      var lng = e.latlng.lng;
      alert("Coordonnées : " + lat + ", " + lng);
    });
  </script>
</body>
</html>
