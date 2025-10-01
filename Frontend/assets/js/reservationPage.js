import { createConfirmationPage, setupConfirmationPageLogic } from './confirmationPage.js';
import { campingService } from '../../services/campingService.js';
import { showToast } from './uiManager.js'; // Importation corrigée

export function createReservationPage() {
  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';
  mainContent.innerHTML = `
    <section class="reservation-form">
      <h2 id="camping-name-display">Réserver votre emplacement de camping</h2>
      <form id="camping-reservation-form">
        <div class="form-group">
          <label for="campsite-select">Sélectionnez un emplacement:</label>
          <select id="campsite-select" name="campsite-id" required>

          </select>
        </div>
        <div class="form-group">
          <label for="num-people">Nombre de personnes:</label>
          <input type="number" id="num-people" name="num-people" min="1" value="1" required />
        </div>
        <div class="form-group">
          <label for="arrival-date">Date d'arrivée:</label>
          <input type="date" id="arrival-date" name="arrival-date" required />
        </div>
        <div class="form-group">
          <label for="departure-date">Date de départ:</label>
          <input type="date" id="departure-date" name="departure-date" required />
        </div>
        <div class="form-group">
          <p>Prix total estimé: <span id="total-price">0</span> €</p>
        </div>
        <button type="submit">Confirmer la réservation</button>
      </form>
    </section>
    <button id="back-to-home">Retour à l'accueil</button>
  `;

  // const header = document.createElement('header');
  // header.className = 'header';
  // header.innerHTML = `
  //   <div class="header-icons">
  //     <img src="/Parc-National-AAA-/Frontend/assets/img/user-icon.png" alt="Profil" id="btn-login" />
  //     <img src="/Parc-National-AAA-/Frontend/assets/img/logo.png" alt="Logo Calanques Réservation" class="logo" />
  //     <img src="/Parc-National-AAA-/Frontend/assets/img/burger-icon.png" alt="Menu" id="btn-menu" />
  //   </div>
  // `;

  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-5 right-5 z-50 space-y-2';

  const pageContainer = document.createElement('div');
  pageContainer.appendChild(mainContent);
  pageContainer.appendChild(toastContainer);

  return pageContainer;
}

// Any specific logic for reservation can go here
// For example, event listeners for the form
export function setupReservationPageLogic(container) {
  const form = container.querySelector('#camping-reservation-form');
  const campsiteSelect = container.querySelector('#campsite-select');
  const numPeopleInput = container.querySelector('#num-people');
  const arrivalDateInput = container.querySelector('#arrival-date');
  const departureDateInput = container.querySelector('#departure-date');
  const totalPriceSpan = container.querySelector('#total-price');
  const campingNameDisplay = container.querySelector('#camping-name-display');
  const backToHomeBtn = container.querySelector('#back-to-home');

  let selectedCampsiteData = null; // Stocke les données de l'emplacement sélectionné

  const urlParams = new URLSearchParams(window.location.search);
  const campingId = urlParams.get('camping_id');
  const campingNameFromUrl = urlParams.get('camping_name');

  if (campingNameFromUrl) {
    campingNameDisplay.textContent = `Réserver pour: ${decodeURIComponent(campingNameFromUrl)}`;
  } else {
    campingNameDisplay.textContent = "Réserver votre emplacement de camping";
  }

  let allCampsites = []; // Variable pour stocker tous les emplacements récupérés

  const fetchCampsites = async () => {
    if (!campingId) return;
    try {
      const data = await campingService.getCampingDetails(campingId);
      if (data && data.camping && data.camping.campsites) {
        allCampsites = data.camping.campsites; // Stocker les emplacements
        campsiteSelect.innerHTML = '<option value="">Choisissez un emplacement</option>';
        allCampsites.forEach(campsite => {
          const option = document.createElement('option');
          option.value = campsite.id;
          option.textContent = `Emplacement ${campsite.number} (Capacité: ${campsite.max_capacity}, Prix/nuit: ${campsite.price_per_night} €)`;
          campsiteSelect.appendChild(option);
        });
      } else {
        console.error("Erreur lors de la récupération des emplacements:", data.message);
        showToast(data.message || "Impossible de charger les emplacements.", "error");
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des emplacements:", error);
      showToast("Erreur de connexion au serveur lors du chargement des emplacements.", "error");
    }
  };

  fetchCampsites();

  const calculateTotalPrice = () => {
    const numPeople = parseInt(numPeopleInput.value, 10);
    const arrival = new Date(arrivalDateInput.value);
    const departure = new Date(departureDateInput.value);

    if (!selectedCampsiteData || isNaN(numPeople) || !arrivalDateInput.value || !departureDateInput.value) {
      totalPriceSpan.textContent = '0';
      return;
    }

    if (departure <= arrival) {
      totalPriceSpan.textContent = 'Date de départ invalide';
      return;
    }

    if (numPeople > selectedCampsiteData.max_capacity) {
      showToast(`Le nombre de personnes dépasse la capacité maximale de l'emplacement (${selectedCampsiteData.max_capacity}).`, "error");
      numPeopleInput.value = selectedCampsiteData.max_capacity;
      // Recalculate price after adjusting people count
      calculateTotalPrice();
      return;
    }

    const diffTime = Math.abs(departure - arrival);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total = diffDays * selectedCampsiteData.price_per_night * numPeople;
    totalPriceSpan.textContent = total.toFixed(2);
  };

  campsiteSelect.addEventListener('change', (e) => {
    const selectedCampsiteId = e.target.value;
    selectedCampsiteData = allCampsites.find(cs => cs.id == selectedCampsiteId);
    calculateTotalPrice();
  });

  numPeopleInput.addEventListener('change', calculateTotalPrice);
  arrivalDateInput.addEventListener('change', calculateTotalPrice);
  departureDateInput.addEventListener('change', calculateTotalPrice);

  // Initialiser les dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayString = today.toISOString().split('T')[0];
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  arrivalDateInput.min = todayString;
  departureDateInput.min = tomorrowString;

  arrivalDateInput.value = todayString;
  departureDateInput.value = tomorrowString;

  // Logique de soumission du formulaire
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!selectedCampsiteData) {
        showToast("Veuillez sélectionner un emplacement de camping.", "error");
        return;
      }

      const campsiteId = selectedCampsiteData.id;
      const numberOfPersons = parseInt(numPeopleInput.value, 10);
      const checkInDate = arrivalDateInput.value;
      const checkOutDate = departureDateInput.value;
      const totalPrice = parseFloat(totalPriceSpan.textContent);

      if (new Date(checkOutDate) <= new Date(checkInDate)) {
        showToast("La date de départ doit être postérieure à la date d'arrivée.", "error");
        return;
      }

      if (numberOfPersons > selectedCampsiteData.max_capacity) {
        showToast(`Le nombre de personnes dépasse la capacité maximale de l'emplacement (${selectedCampsiteData.max_capacity}).`, "error");
        return;
      }

      // Assumons que l'ID utilisateur est géré via la session côté serveur ou est un ID fixe pour l'instant
      const userId = 1; 

      try {
        const response = await fetch("/Parc-National-AAA-/Backend/api/reservations.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            campsite_id: campsiteId,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            number_of_persons: numberOfPersons,
            total_price: totalPrice // Envoyer le prix total calculé
          }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          showToast("Réservation créée avec succès !", "success");
          const basePath = '/Parc-National-AAA-'; // Assurez-vous que cela correspond au basePath dans main.js
          const confirmationUrl = `${basePath}/confirmation`; // Utiliser le chemin défini dans le routeur

          history.pushState(
            {
              page: 'confirmation',
              reservationDetails: {
                reservation_id: result.reservation_id,
                total_price: totalPrice,
                camping_name: campingNameFromUrl || "Camping inconnu",
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                number_of_persons: numberOfPersons,
              },
            },
            '',
            confirmationUrl
          );
          window.dispatchEvent(new Event('popstate'));
        } else {
          showToast(`Erreur lors de la réservation: ${result.message}`, "error");
        }
      } catch (error) {
        console.error("Erreur réseau ou du serveur:", error);
        showToast("Une erreur est survenue. Veuillez réessayer.", "error");
      }
    });
  }

  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
      history.pushState({ page: 'home' }, '', '/');
      window.dispatchEvent(new Event('popstate'));
    });
  }
}
