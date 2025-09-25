export function createConfirmationPage(reservationDetails) {
  const mainContent = document.createElement('main');
  mainContent.className = 'main-content';
  mainContent.innerHTML = `
    <section class="confirmation-details">
      <h2>Votre Réservation est Confirmée !</h2>
      <p>Merci pour votre réservation. Voici les détails :</p>
      <p><strong>ID de réservation:</strong> <span id="reservation-id">${reservationDetails.reservationId || 'N/A'}</span></p>
      <p><strong>Camping:</strong> <span id="camping-name">${reservationDetails.campingName || 'N/A'}</span></p>
      <p><strong>Date d'arrivée:</strong> <span id="check-in-date">${reservationDetails.arrivalDate || 'N/A'}</span></p>
      <p><strong>Date de départ:</strong> <span id="check-out-date">${reservationDetails.departureDate || 'N/A'}</span></p>
      <p><strong>Nombre de personnes:</strong> <span id="number-of-persons">${reservationDetails.numberOfPersons || 'N/A'}</span></p>
      <p><strong>Prix total:</strong> <span id="total-price">${reservationDetails.totalPrice ? reservationDetails.totalPrice + ' €' : 'N/A'}</span></p>

      <button id="cancel-reservation-btn">Annuler la réservation</button>
      <button id="back-to-home-btn">Retour à l'accueil</button>
    </section>
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

export function setupConfirmationPageLogic(container) {
  const cancelBtn = container.querySelector('#cancel-reservation-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      alert('Réservation annulée !'); // Placeholder for actual cancellation logic
      history.pushState({ page: 'home' }, '', '/');
      window.dispatchEvent(new Event('popstate'));
    });
  }

  const backToHomeBtn = container.querySelector('#back-to-home-btn');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
      history.pushState({ page: 'home' }, '', '/');
      window.dispatchEvent(new Event('popstate'));
    });
  }
}
