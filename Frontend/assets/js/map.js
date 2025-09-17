let map;
let mapInitialized = false;

const homeSection = document.getElementById("home-section");
const sentiersSection = document.getElementById("sentiers-section");
const btnShowMap = document.getElementById("btn-show-map");
const btnBackHome = document.getElementById("btn-back-home");

// Ouvrir la carte
btnShowMap.addEventListener("click", async function() {
  homeSection.classList.add("hidden");
  sentiersSection.classList.remove("hidden");

  if (!mapInitialized) {
    map = L.map('map').setView([43.214, 5.433], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // Charger les sentiers depuis PHP
    const res = await fetch("sentiers_crud.php");
    const sentiers = await res.json();

    sentiers.forEach(s => {
      L.marker([s.latitude, s.longitude])
        .addTo(map)
        .bindPopup("<b>" + s.nom + "</b><br>" + s.description +
                   "<br><a href='sentiers_crud.php?delete=" + s.id + "'>Supprimer</a>");
    });

    // Remplir les champs latitude/longitude au clic
    map.on('click', function(e) {
      document.getElementById('latitude').value = e.latlng.lat;
      document.getElementById('longitude').value = e.latlng.lng;
    });

    mapInitialized = true;
  }
});

// Retour à l’accueil
btnBackHome.addEventListener("click", function() {
  sentiersSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
});
