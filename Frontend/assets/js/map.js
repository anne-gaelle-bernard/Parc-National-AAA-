// Initialisation
let map;

// Affiche la carte
function showMap() {
  document.getElementById("map-wrapper").classList.remove("hidden");

  if (!map) {
    map = L.map("map").setView([43.216, 5.435], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap"
    }).addTo(map);

    const sentiers = [
      {
        name: "Calanque de Sugiton",
        coords: [43.2156, 5.4411],
        difficulty: "Facile",
        trail: "Sentier agréable, accessible depuis Luminy."
      },
      {
        name: "Calanque d’En-Vau",
        coords: [43.2042, 5.4989],
        difficulty: "Difficile",
        trail: "Randonnée technique avec passages escarpés."
      },
      {
        name: "Calanque de Morgiou",
        coords: [43.2194, 5.4333],
        difficulty: "Moyen",
        trail: "Chemin escarpé mais accessible, vue magnifique."
      },
      {
        name: "Calanque de Port-Miou",
        coords: [43.2106, 5.5125],
        difficulty: "Facile",
        trail: "Balade douce le long de la mer."
      }
    ];

    sentiers.forEach(s => {
      L.marker(s.coords).addTo(map).bindPopup(`
        <b>${s.name}</b><br>
        Niveau : <span style="color:${
          s.difficulty === "Facile" ? "green" : s.difficulty === "Moyen" ? "orange" : "red"
        }">${s.difficulty}</span><br>
        Sentier : ${s.trail}
      `);
    });
  }
}

// Ferme la carte
document.getElementById("close-map").addEventListener("click", () => {
  document.getElementById("map-wrapper").classList.add("hidden");
});

// Bouton "Découvrir les Parcs Nationaux"
document.getElementById("btn-show-map").addEventListener("click", showMap);
