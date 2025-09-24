import { createReservationPage, setupReservationPageLogic } from './reservationPage.js';
import { createConfirmationPage, setupConfirmationPageLogic } from './confirmationPage.js';

const init = () => {
  // --- Sélection des éléments DOM ---
  const btnLogin = document.getElementById("btn-login");
  const modalLogin = document.getElementById("modal-login");
  const loginMessage = document.getElementById("login-message");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const btnLoginSubmit = document.getElementById("btn-login-submit");
  const switchToRegister = document.getElementById("switch-to-register");

  const modalRegister = document.getElementById("modal-register");
  const registerMessage = document.getElementById("register-message");
  const registerFirstName = document.getElementById("register-first-name");
  const registerLastName = document.getElementById("register-last-name");
  const registerEmail = document.getElementById("register-email");
  const registerPassword = document.getElementById("register-password");
  const btnRegisterSubmit = document.getElementById("btn-register-submit");
  const switchToLogin = document.getElementById("switch-to-login");

  const userOverlay = document.getElementById("user-overlay");
  const closeUserOverlay = document.getElementById("close-user-overlay");
  const btnLogout = document.getElementById("btn-logout");
  const btnShowUserReservations = document.getElementById("btn-show-user-reservations");

  const btnMenu = document.getElementById("btn-menu");
  const burgerOverlay = document.getElementById("burger-overlay");
  const closeBurgerOverlay = document.getElementById("close-burger-overlay");
  const btnShowCampings = document.getElementById("btn-show-campings");
  const btnReserveCampings = document.getElementById("btn-reserve-campings");

  // Removed old containers as content will be dynamically loaded
  // const reservationCampingsPageContainer = document.getElementById("reservation-campings-page-container");
  // const campingDetailsView = document.getElementById("camping-details-view");
  // const userReservationsPageContainer = document.getElementById("user-reservations-page-container");

  const toastContainer = document.getElementById("toast-container");
  const mainContent = document.querySelector(".main-content");
  const cards = document.querySelectorAll(".card");

  // --- Variables d'état ---
  let isLoggedIn = false;

  // --- Données (simulées) ---
  const campings = [
    {
      id: "sormiou",
      name: "Camping de SORMIOU",
      image: "/Parc-National-AAA-/Frontend/assets/img/Camping de SORMIOU.jpg",
      description:
        "Découvrez le magnifique camping de Sormiou, idéalement situé près de la calanque. Profitez d'un cadre naturel exceptionnel pour vos vacances.",
    },
    {
      id: "morgiou",
      name: "Camping de MORGIOU",
      image: "/Parc-National-AAA-/Frontend/assets/img/Camping de MORGIOU.jpg",
      description:
        "Le camping de Morgiou offre une vue imprenable sur la mer et un accès facile aux sentiers de randonnée. Parfait pour les amoureux de la nature.",
    },
    {
      id: "callelongue",
      name: "Camping de CALLELONGUE",
      image: "/Parc-National-AAA-/Frontend/assets/img/Camping de CALLELONGUE.jpg",
      description:
        "Situé dans la charmante calanque de Callelongue, ce camping est un havre de paix. Idéal pour la détente et les activités nautiques.",
    },
  ];

  // --- Fonctions utilitaires ---
  const toggleHidden = (element) => {
    if (element) element.classList.toggle("hidden");
  };

  const showToast = (message, type = "info") => {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} p-3 rounded shadow-lg text-white`;
    toast.textContent = message;
    if (toastContainer) toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast) toast.remove();
    }, 3000);
  };

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
    }
    else {
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

  // --- New Page Creation Functions ---
  const createHomePage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <section class="card">
            <img src="/Parc-National-AAA-/Frontend/assets/img/photo-parc.png" alt="Parc National" />
            <div class="card-text">Découvrir les Parcs Nationaux</div>
        </section>
        <section class="card">
            <img src="/Parc-National-AAA-/Frontend/assets/img/photo-parc2.png" alt="Réserver un parc" />
            <div class="card-text">Réserver</div>
        </section>
    `;

    container.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === 0) {
                // showToast("Logique pour découvrir les parcs (à implémenter).", "info");
                // Here you would navigate to a page showing park details, or trigger a modal
                history.pushState({ page: 'parks' }, '', '/parks'); // Example navigation
                window.dispatchEvent(new Event('popstate'));
            } else if (index === 1) {
                // Désactiver la redirection de la carte 'Réserver' pour n'utiliser que le lien du menu burger
                // history.pushState({ page: 'campings' }, '', '/campings');
                // window.dispatchEvent(new Event('popstate'));
            }
        });
    });
    return container;
  };

  const setupHomePageLogic = (container) => {
      // No specific logic needed for home page for now other than card clicks
  };

  const createCampingsListPage = () => {
      const container = document.createElement('div');
      container.innerHTML = `
          <h2>Nos Campings</h2>
          <div id="campings-list-dynamic" class="grid-container"></div>
          <button id="back-to-home-from-campings-list-dynamic">Retour à l'accueil</button>
      `;
      const dynamicCampingsListContainer = container.querySelector('#campings-list-dynamic');

      campings.forEach((camping) => {
          const campingCard = document.createElement("div");
          campingCard.className = "camping-card";
          campingCard.innerHTML = `
              <img src="${camping.image}" alt="${camping.name}" />
              <div class="card-text">${camping.name}</div>
          `;
          campingCard.addEventListener("click", () => {
              history.pushState({ page: 'camping-details', campingId: camping.id }, '', `/camping-details/${camping.id}`);
              window.dispatchEvent(new Event('popstate'));
          });
          dynamicCampingsListContainer.appendChild(campingCard);
      });

      container.querySelector('#back-to-home-from-campings-list-dynamic').addEventListener('click', () => {
          history.pushState({ page: 'home' }, '', '/');
          window.dispatchEvent(new Event('popstate'));
      });

      return container;
  };

  const setupCampingsListPageLogic = (container) => {
      // Logic already attached during creation
  };


  const createCampingDetailsPage = (campingId) => {
      const camping = campings.find((c) => c.id === campingId);
      if (!camping) {
          return document.createTextNode('Camping non trouvé.');
      }
      const container = document.createElement('div');
      container.innerHTML = `
          <button id="back-to-campings-list-dynamic">Retour à la liste des campings</button>
          <h2 id="camping-detail-title-dynamic">${camping.name}</h2>
          <img id="camping-detail-image-dynamic" src="${camping.image}" alt="${camping.name}" />
          <p id="camping-detail-description-dynamic">${camping.description}</p>
          <button id="reserve-this-camping-dynamic">Réserver ce camping</button>
      `;

      container.querySelector('#back-to-campings-list-dynamic').addEventListener('click', () => {
          history.pushState({ page: 'campings' }, '', '/campings');
          window.dispatchEvent(new Event('popstate'));
      });

      container.querySelector('#reserve-this-camping-dynamic').addEventListener('click', () => {
          // Pass camping details to reservation page if needed
          history.pushState({ page: 'reservation', campingName: camping.name }, '', '/reservation');
          window.dispatchEvent(new Event('popstate'));
      });

      return container;
  };

  const setupCampingDetailsPageLogic = (container) => {
      // Logic already attached during creation
  };

  const createUserReservationsPage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Mes Réservations</h2>
        <p>Voici la liste de vos réservations passées et futures (logique à implémenter).</p>
        <button id="back-to-home-from-user-reservations-dynamic">Retour à l'accueil</button>
    `;
    container.querySelector('#back-to-home-from-user-reservations-dynamic').addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new Event('popstate'));
    });
    return container;
  };

  const setupUserReservationsPageLogic = (container) => {
      // Logic already attached during creation
  };


  // --- Attachement des écouteurs d'événements ---
  window.addEventListener('popstate', router);

  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      if (isLoggedIn) {
        toggleHidden(userOverlay);
      } else {
        toggleHidden(modalLogin);
      }
    });
  }

  document.addEventListener("click", (event) => {
    if (
      modalLogin &&
      !modalLogin.classList.contains("hidden") &&
      !event.target.closest("#modal-login") &&
      !event.target.closest("#btn-login")
    ) {
      toggleHidden(modalLogin);
    }
    if (
      modalRegister &&
      !modalRegister.classList.contains("hidden") &&
      !event.target.closest("#modal-register") &&
      !event.target.closest("#switch-to-register")
    ) {
      toggleHidden(modalRegister);
    }
    if (
      userOverlay &&
      !userOverlay.classList.contains("hidden") &&
      !event.target.closest("#user-overlay") &&
      !event.target.closest("#btn-login")
    ) {
      toggleHidden(userOverlay);
    }
    if (
      burgerOverlay &&
      !burgerOverlay.classList.contains("hidden") &&
      !event.target.closest("#burger-overlay") &&
      !event.target.closest("#btn-menu")
    ) {
      toggleHidden(burgerOverlay);
    }
  });

  if (switchToRegister) {
    switchToRegister.addEventListener("click", () => {
      toggleHidden(modalLogin);
      toggleHidden(modalRegister);
    });
  }

  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", async () => {
      const email = loginEmail.value;
      const password = loginPassword.value;

      try {
        const response = await fetch('/Parc-National-AAA-/Backend/api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          isLoggedIn = true;
          toggleHidden(modalLogin);
          showToast("Connexion réussie !", "success");
          toggleHidden(userOverlay);
          // Optional: Update user details in UI if needed
        } else {
          if (loginMessage) loginMessage.textContent = result.message || "Email ou mot de passe incorrect.";
          showToast(result.message || "Échec de la connexion.", "error");
        }
      } catch (error) {
        console.error("Error during login:", error);
        if (loginMessage) loginMessage.textContent = "Une erreur est survenue lors de la connexion.";
        showToast("Une erreur est survenue. Veuillez réessayer.", "error");
      }
    });
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", () => {
      toggleHidden(modalRegister);
      toggleHidden(modalLogin);
    });
  }

  if (btnRegisterSubmit) {
    btnRegisterSubmit.addEventListener("click", async () => {
      const firstName = registerFirstName.value;
      const lastName = registerLastName.value;
      const email = registerEmail.value;
      const password = registerPassword.value;

      try {
        const response = await fetch('/Parc-National-AAA-/Backend/api/register.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          showToast("Inscription réussie ! Vous pouvez maintenant vous connecter.", "success");
          toggleHidden(modalRegister);
          toggleHidden(modalLogin);
        } else {
          if (registerMessage) registerMessage.textContent = result.message || "Erreur lors de l'inscription.";
          showToast(result.message || "Échec de l'inscription.", "error");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        if (registerMessage) registerMessage.textContent = "Une erreur est survenue lors de l'inscription.";
        showToast("Une erreur est survenue. Veuillez réessayer.", "error");
      }
    });
  }

  if (closeUserOverlay) {
    closeUserOverlay.addEventListener("click", () => {
      toggleHidden(userOverlay);
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      try {
        const response = await fetch('/Parc-National-AAA-/Backend/api/logout.php');
        const result = await response.json();

        if (response.ok && result.status === 'success') {
          isLoggedIn = false;
          toggleHidden(userOverlay);
          showToast("Vous avez été déconnecté.", "info");
        } else {
          showToast(result.message || "Échec de la déconnexion.", "error");
        }
      } catch (error) {
        console.error("Error during logout:", error);
        showToast("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.", "error");
      }
    });
  }

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      toggleHidden(burgerOverlay);
    });
  }

  if (closeBurgerOverlay) {
    closeBurgerOverlay.addEventListener("click", () => {
      toggleHidden(burgerOverlay);
    });
  }

  if (btnShowCampings) {
    btnShowCampings.addEventListener("click", (e) => {
      e.preventDefault();
      // showToast("Cette section sera bientôt disponible.", "info"); // Option: afficher un message
      // Ne rien faire ou ajouter une autre logique si désiré
      toggleHidden(burgerOverlay); // Fermer le menu burger
    });
  }

  if (btnReserveCampings) {
    btnReserveCampings.addEventListener("click", (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        history.pushState({ page: 'campings' }, '', '/campings');
        window.dispatchEvent(new Event('popstate'));
        toggleHidden(burgerOverlay);
      } else {
        showToast("Veuillez vous connecter pour réserver un camping.", "error");
        toggleHidden(modalLogin); // Ouvre le modal de connexion
        toggleHidden(burgerOverlay); // Ferme le menu burger
      }
    });
  }

  if (btnShowUserReservations) {
    btnShowUserReservations.addEventListener("click", () => {
      history.pushState({ page: 'user-reservations' }, '', '/user-reservations');
      window.dispatchEvent(new Event('popstate'));
      toggleHidden(userOverlay);
    });
  }

  // Initial routing
  router();

  // Check session status on page load
  fetch('/Parc-National-AAA-/Backend/api/check-session.php')
    .then(response => response.json())
    .then(data => {
      isLoggedIn = data.loggedIn;
      if (isLoggedIn) {
        // Potentially update UI for logged in user
        console.log("User is logged in:", data.user.first_name);
      }
    })
    .catch(error => {
      console.error("Error checking session:", error);
      isLoggedIn = false;
    });
};

document.addEventListener("DOMContentLoaded", init);
