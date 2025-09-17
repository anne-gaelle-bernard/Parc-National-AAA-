
    let map;
    let mapInitialized = false;

    const homeSection = document.getElementById("home-section");
    const mapSection = document.getElementById("sentiers-section");
    const btnShowMap = document.getElementById("btn-show-map");
    const btnBackHome = document.getElementById("btn-back-home");

    // Aller vers la carte
    btnShowMap.addEventListener("click", function() {
      homeSection.style.display = "none";
      mapSection.style.display = "block";

      // Initialiser la carte seulement une fois
      if (!mapInitialized) {
        map = L.map('map').setView([43.214, 5.433], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        // Charger sentiers via API PHP
        fetch("sentiers_api.php")
          .then(res => res.json())
          .then(sentiers => {
            sentiers.forEach(s => {
              L.marker([s.latitude, s.longitude])
                .addTo(map)
                .bindPopup("<b>" + s.nom + "</b><br>" + s.description +
                           "<br><a href='sentiers_crud.php?delete=" + s.id + "'>Supprimer</a>");
            });
          });

        // Coordonnées au clic
        map.on('click', function(e) {
          document.getElementById('latitude').value = e.latlng.lat;
          document.getElementById('longitude').value = e.latlng.lng;
        });

        mapInitialized = true;
      }
    });

    // Retour à l’accueil
    btnBackHome.addEventListener("click", function() {
      mapSection.style.display = "none";
      homeSection.style.display = "block";
    });
 