import { createReservationPage, setupReservationPageLogic } from './reservationPage.js';
import { createConfirmationPage, setupConfirmationPageLogic } from './confirmationPage.js';
// import { showToast } from './main.js'; // showToast est maintenant géré par uiManager.js
import { createHomePage, setupHomePageLogic } from './homePage.js';
import { createCampingsListPage, setupCampingsListPageLogic } from './campingsPage.js';
import { createCampingDetailsPage, setupCampingDetailsPageLogic } from './campingDetailsPage.js';
import { createUserReservationsPage, setupUserReservationsPageLogic } from './userReservationsPage.js';
import { setupUIManager } from './uiManager.js';

const init = () => {
  const toastContainer = document.getElementById("toast-container");
  const mainContent = document.querySelector(".main-content");
  
  // --- Router ---
  const router = () => {
    mainContent.innerHTML = ''; // Clear existing content
    const path = window.location.pathname;
    let pageContent = null;
    let pageLogicSetup = null;

    if (path === '/campings') {
        pageContent = createCampingsListPage();
        pageLogicSetup = setupCampingsListPageLogic;
    } else if (path === '/reservation') {
      pageContent = createReservationPage();
      pageLogicSetup = setupReservationPageLogic;
    } else if (path === '/confirmation') {
        const state = history.state || {};
        pageContent = createConfirmationPage(state.reservationDetails || {});
        pageLogicSetup = setupConfirmationPageLogic;
    } else if (path.startsWith('/camping-details/')) {
        const campingId = path.split('/').pop();
        pageContent = createCampingDetailsPage(campingId); // New function to create camping details
        pageLogicSetup = setupCampingDetailsPageLogic; // New function to setup camping details logic
    } else if (path === '/user-reservations') {
        pageContent = createUserReservationsPage(); // New function for user reservations
        pageLogicSetup = setupUserReservationsPageLogic; // New function to setup user reservations logic
    } else {
      // Default home page content
      pageContent = createHomePage(); // A new function to create the home page
      pageLogicSetup = setupHomePageLogic; // A new function to setup home page logic
    }

    if (pageContent) {
      mainContent.appendChild(pageContent);
      if (pageLogicSetup) {
        pageLogicSetup(pageContent);
      }
    }
  };

  window.addEventListener('popstate', router);
  setupUIManager(toastContainer);
};

document.addEventListener("DOMContentLoaded", init);
