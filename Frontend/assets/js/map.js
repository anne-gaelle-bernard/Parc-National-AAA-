var map = L.map('map').setView([43.21, 5.45], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const API_BASE = '/Parc-National-AAA-/Backend/api';

const difficultyColors = { easy: 'green', medium: 'orange', hard: 'red' };
const difficultyLabels = { easy: 'Facile', medium: 'Moyenne', hard: 'Difficile' };
const resourceColors = { fauna: 'purple', flora: 'green' };
const resourceLabels = { fauna: 'Faune', flora: 'Flore' };

const trailLayers = { easy: L.layerGroup(), medium: L.layerGroup(), hard: L.layerGroup() };
const resourceLayers = { fauna: L.layerGroup(), flora: L.layerGroup() };

function parseCoordinates(gpsString) {
  if (!gpsString) return null;
  const [lat, lon] = gpsString.split(',').map((v) => parseFloat(v.trim()));
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return [lat, lon];
}

function renderTrails(trails) {
  const bounds = [];

  trails.forEach((trail) => {
    const difficulty = (trail.difficulty || 'medium').toLowerCase();
    const layer = trailLayers[difficulty] || trailLayers.medium;
    const color = difficultyColors[difficulty] || 'blue';

    const points = (trail.points_of_interest || [])
      .map((poi) => ({ ...poi, coords: parseCoordinates(poi.gps_coordinates) }))
      .filter((poi) => poi.coords);

    if (points.length === 0) return;

    const destination = points[points.length - 1];
    const marker = L.circleMarker(destination.coords, { radius: 8, color, fillOpacity: 0.9 }).bindPopup(
      `<strong>${trail.name}</strong><br/>${trail.description || ''}<br/><em>Difficulté :</em> ${difficultyLabels[difficulty] || difficulty}` +
      (trail.estimated_duration ? `<br/><em>Durée estimée :</em> ${trail.estimated_duration}` : '')
    );
    marker.addTo(layer);
    bounds.push(destination.coords);

    points.forEach((poi) => {
      const poiMarker = L.marker(poi.coords).bindPopup(`<strong>${poi.name}</strong><br/>${poi.description || ''}`);
      poiMarker.addTo(layer);
      bounds.push(poi.coords);
    });

    if (points.length > 1) {
      L.polyline(points.map((p) => p.coords), { weight: 3, opacity: 0.6, color }).addTo(layer);
    }
  });

  return bounds;
}

function renderResources(resources, trailsById) {
  const bounds = [];

  resources.forEach((resource) => {
    const type = resource.species_type;
    const layer = resourceLayers[type];
    if (!layer) return;

    const trail = trailsById[resource.trail_id];
    const points = trail ? (trail.points_of_interest || []).map((poi) => parseCoordinates(poi.gps_coordinates)).filter(Boolean) : [];
    if (points.length === 0) return;

    const coords = points[0];
    const marker = L.circleMarker(coords, { radius: 6, color: resourceColors[type], fillOpacity: 0.7 }).bindPopup(
      `<strong>${resource.species_name}</strong><br/>${resource.description || ''}<br/><em>Lieu :</em> ${resource.location || 'Non précisé'}`
    );
    marker.addTo(layer);
    bounds.push(coords);
  });

  return bounds;
}

function buildLegend() {
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML = '<strong>Difficulté des sentiers</strong><br/>' +
      '<i style="background:green;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Facile<br/>' +
      '<i style="background:orange;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Moyenne<br/>' +
      '<i style="background:red;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Difficile<br/><br/>' +
      '<strong>Ressources naturelles</strong><br/>' +
      '<i style="background:green;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Flore<br/>' +
      '<i style="background:purple;width:12px;height:12px;display:inline-block;margin-right:6px"></i> Faune<br/>';
    return div;
  };
  legend.addTo(map);
}

async function init() {
  try {
    const [trails, resources] = await Promise.all([
      fetch(`${API_BASE}/trails.php`).then((r) => r.json()),
      fetch(`${API_BASE}/resources.php`).then((r) => r.json()),
    ]);

    const trailsById = {};
    trails.forEach((t) => { trailsById[t.id] = t; });

    const trailBounds = renderTrails(trails);
    const resourceBounds = renderResources(resources, trailsById);

    L.control.layers(
      { 'Facile': trailLayers.easy, 'Moyenne': trailLayers.medium, 'Difficile': trailLayers.hard },
      { 'Flore': resourceLayers.flora, 'Faune': resourceLayers.fauna },
      { collapsed: false }
    ).addTo(map);

    buildLegend();

    Object.values(trailLayers).forEach((layer) => layer.addTo(map));
    Object.values(resourceLayers).forEach((layer) => layer.addTo(map));

    const allBounds = [...trailBounds, ...resourceBounds];
    if (allBounds.length > 0) {
      map.fitBounds(L.latLngBounds(allBounds).pad(0.2));
    }
  } catch (error) {
    console.error('Impossible de charger les sentiers/ressources depuis le serveur :', error);
  }
}

init();
