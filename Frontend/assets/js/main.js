// assets/js/main.js
(() => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const targetCard = cards.find(c => c.textContent.trim().includes('Découvrir')) || cards[0];

  const modal = document.getElementById('map-modal');
  const closeBtn = document.getElementById('close-map-modal');
  const mapDiv = document.getElementById('map');
  const controls = document.getElementById('map-controls');

  let mapLoaded = false;
  let map, markersLayer;

  // Colors by difficulty
  const diffColor = { easy: '#2ecc71', medium: '#f39c12', hard: '#e74c3c' };

  function getColorForDifficulty(d) { return diffColor[d] || '#3498db'; }

  function showModal() {
    modal.classList.remove('hidden');
    if (!mapLoaded) initMap();
  }
  function hideModal() { modal.classList.add('hidden'); }

  targetCard.addEventListener('click', showModal);
  closeBtn.addEventListener('click', hideModal);

  async function initMap() {
    mapLoaded = true;
    map = L.map(mapDiv).setView([43.212, 5.47], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Use marker cluster group
    markersLayer = L.markerClusterGroup();
    map.addLayer(markersLayer);

    try {
      const res = await fetch('/api/calanques.php');
      if (!res.ok) throw new Error('Erreur chargement calanques');
      const geojson = await res.json();

      L.geoJSON(geojson, {
        pointToLayer: function(feature, latlng) {
          const diff = (feature.properties && feature.properties.difficulty) || 'unknown';
          const color = getColorForDifficulty(diff);
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: color,
            color: '#222',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
          });
        },
        onEachFeature: function(feature, layer) {
          const p = feature.properties || {};
          const html = `<strong>${p.name || 'Calanque'}</strong><br/>Niveau: ${p.difficulty || '—'}<br/>${p.description || ''}`;
          layer.bindPopup(html);
          layer.feature = feature;
          markersLayer.addLayer(layer);
        }
      });

      const bounds = markersLayer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));

      addLegend();
      wireFilters();

    } catch (err) {
      console.error(err);
      mapDiv.innerHTML = '<p>Impossible de charger la carte. Vérifiez le backend.</p>';
    }
  }

  function addLegend() {
    const legend = document.getElementById('map-legend');
    legend.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <div><span style="display:inline-block;width:14px;height:14px;background:${diffColor.easy};border-radius:3px;margin-right:6px"></span>Facile</div>
        <div><span style="display:inline-block;width:14px;height:14px;background:${diffColor.medium};border-radius:3px;margin-right:6px"></span>Moyen</div>
        <div><span style="display:inline-block;width:14px;height:14px;background:${diffColor.hard};border-radius:3px;margin-right:6px"></span>Difficile</div>
      </div>
    `;
  }

  function wireFilters() {
    const inputs = Array.from(controls.querySelectorAll('input[type=checkbox]'));
    function updateVisibility() {
      const active = inputs.filter(i => i.checked).map(i => i.dataset.diff);
      markersLayer.eachLayer(layer => {
        // markercluster wraps layers; get original feature if present
        const feat = (layer.feature) ? layer.feature : (layer.options && layer.options.feature) ? layer.options.feature : null;
        const props = feat && feat.properties ? feat.properties : {};
        const d = props.difficulty || 'unknown';
        // Show/hide marker by adding/removing it from cluster group
        if (active.includes(d)) {
          if (!markersLayer.hasLayer(layer)) markersLayer.addLayer(layer);
        } else {
          if (markersLayer.hasLayer(layer)) markersLayer.removeLayer(layer);
        }
      });
    }
    inputs.forEach(i => i.addEventListener('change', updateVisibility));
  }

})();
