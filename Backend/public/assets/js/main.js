// assets/js/main.js (public)
(() => {
  const cards = Array.from(document.querySelectorAll('.card'));
  const targetCard = cards.find(c => c.textContent.trim().includes('Découvrir')) || cards[0];

  const modal = document.getElementById('map-modal');
  const closeBtn = document.getElementById('close-map-modal');
  const mapDiv = document.getElementById('map');
  const controls = document.getElementById('map-controls');

  const modalLogin = document.getElementById('modal-login');
  const modalRegister = document.getElementById('modal-register');

  const btnLoginIcon = document.getElementById('btn-login');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const btnRegisterSubmit = document.getElementById('btn-register-submit');
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');

  const loginMessage = document.getElementById('login-message');
  const registerMessage = document.getElementById('register-message');

  const userOverlay = document.getElementById('user-overlay');
  const burgerOverlay = document.getElementById('burger-overlay');
  const btnCloseUserOverlay = document.getElementById('close-user-overlay');
  const btnMenu = document.getElementById('btn-menu');
  const btnCloseBurgerOverlay = document.getElementById('close-burger-overlay');

  let mapLoaded = false;
  let map, markersLayer;

  const diffColor = { easy: '#2ecc71', medium: '#f39c12', hard: '#e74c3c' };
  function getColorForDifficulty(d) { return diffColor[d] || '#3498db'; }

  // Toast helpers
  function showToast(message, type = 'success', timeoutMs = 2500) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slide-out 0.3s forwards';
      setTimeout(() => container.removeChild(toast), 300);
    }, timeoutMs);
  }

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  function openLogin() { hide(modalRegister); show(modalLogin); }
  function openRegister() { hide(modalLogin); show(modalRegister); }

  btnLoginIcon?.addEventListener('click', openLogin);
  switchToRegister?.addEventListener('click', openRegister);
  switchToLogin?.addEventListener('click', openLogin);

  btnCloseUserOverlay?.addEventListener('click', () => hide(userOverlay));
  btnMenu?.addEventListener('click', () => show(burgerOverlay));
  btnCloseBurgerOverlay?.addEventListener('click', () => hide(burgerOverlay));

  function showMapModal() {
    show(modal);
    if (!mapLoaded) initMap();
  }
  function hideMapModal() { hide(modal); }

  targetCard?.addEventListener('click', showMapModal);
  closeBtn?.addEventListener('click', hideMapModal);

  async function initMap() {
    mapLoaded = true;
    map = L.map(mapDiv).setView([43.212, 5.47], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);
    markersLayer = L.markerClusterGroup();
    map.addLayer(markersLayer);
    try {
      const res = await fetch('/api/calanques.php');
      if (!res.ok) throw new Error('Erreur chargement calanques');
      const geojson = await res.json();
      L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          const diff = (feature.properties && feature.properties.difficulty) || 'unknown';
          const color = getColorForDifficulty(diff);
          return L.circleMarker(latlng, { radius: 8, fillColor: color, color: '#222', weight: 1, opacity: 1, fillOpacity: 0.9 });
        },
        onEachFeature: (feature, layer) => {
          const p = feature.properties || {};
          const html = `<strong>${p.name || 'Calanque'}</strong><br/>Niveau: ${p.difficulty || '—'}<br/>${p.description || ''}`;
          layer.bindPopup(html);
          layer.feature = feature;
          markersLayer.addLayer(layer);
        }
      });
      const bounds = markersLayer.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.2));
    } catch (err) {
      console.error(err);
      mapDiv.innerHTML = '<p>Impossible de charger la carte. Vérifiez le backend.</p>';
    }
  }

  // Auth wiring
  async function postJson(url, data) {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const json = await res.json().catch(() => ({ success: false, message: 'Réponse invalide' }));
    if (!res.ok) return { success: false, message: json.message || `HTTP ${res.status}` };
    return json;
  }

  btnLoginSubmit?.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    loginMessage.textContent = '';
    const resp = await postJson('/api/auth.php?action=login', { email, password });
    if (resp.success) {
      showToast('Connexion réussie');
      hide(modalLogin);
      show(userOverlay);
    } else {
      loginMessage.textContent = resp.message || 'Échec connexion';
    }
  });

  btnRegisterSubmit?.addEventListener('click', async () => {
    const firstName = document.getElementById('register-first-name').value.trim();
    const lastName = document.getElementById('register-last-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    registerMessage.textContent = '';
    const resp = await postJson('/api/auth.php?action=register', { firstName, lastName, email, password });
    if (resp.success) {
      showToast('Inscription réussie');
      hide(modalRegister);
      openLogin();
    } else {
      registerMessage.textContent = resp.message || "Échec de l'inscription";
    }
  });
})();


