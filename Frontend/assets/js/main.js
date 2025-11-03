import { createReservationPage, setupReservationPageLogic } from './reservationPage.js';
import { createConfirmationPage, setupConfirmationPageLogic } from './confirmationPage.js';
// import { showToast } from './main.js'; // showToast est maintenant géré par uiManager.js
import { createHomePage, setupHomePageLogic } from './homePage.js';
import { createCampingsListPage, setupCampingsListPageLogic } from './campingsPage.js';
import { createCampingDetailsPage, setupCampingDetailsPageLogic } from './campingDetailsPage.js';
import { createUserReservationsPage, setupUserReservationsPageLogic } from './userReservationsPage.js';
import { createResourcesPage, setupResourcesPageLogic } from './resourcesPage.js';
import { setupUIManager } from './uiManager.js';

const init = () => {
  const toastContainer = document.getElementById("toast-container");
  const mainContent = document.querySelector(".main-content");
  
  // --- Router ---
  const router = () => {
    mainContent.innerHTML = ''; // Clear existing content
    let path = window.location.pathname;
    const basePath = '';

    // Strip basePath if present
    if (path.startsWith(basePath)) {
        path = path.substring(basePath.length);
    }
    // Ensure path starts with a slash, even if basePath was just '/' and stripped
    if (!path.startsWith('/')) {
        path = '/' + path;
    }

    let pageContent = null;
    let pageLogicSetup = null;

    if (path === '/campings') {
        pageContent = createCampingsListPage();
        pageLogicSetup = setupCampingsListPageLogic;
    } else if (path.startsWith('/reservation')) {
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
    } else if (path === '/ressources-naturelles') {
        pageContent = createResourcesPage(); // Page ressources naturelles
        pageLogicSetup = setupResourcesPageLogic;
    } else if (path === '/') { // Handle root path
      // Default home page content
      pageContent = createHomePage(); // A new function to create the home page
      pageLogicSetup = setupHomePageLogic; // A new function to setup home page logic
    } else {
      // Fallback for unknown paths, maybe a 404 page or redirect to home
      console.warn("Unhandled path:", path); // Log the actual unhandled path
      pageContent = createHomePage(); // Redirect to home for unhandled paths
      pageLogicSetup = setupHomePageLogic;
    }

    if (pageContent) {
      mainContent.appendChild(pageContent);
      if (pageLogicSetup) {
        pageLogicSetup(pageContent);
      }
    }
  };

  window.addEventListener('popstate', router);
  // Appeler router une fois au chargement initial pour afficher le bon contenu
  router(); 
  setupUIManager(toastContainer);
};

document.addEventListener("DOMContentLoaded", init);
