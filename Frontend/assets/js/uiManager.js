export const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type} p-3 rounded shadow-lg text-white`;
  toast.textContent = message;
  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast) toast.remove();
  }, 3000);
};

export const setupUIManager = (mainContent) => {
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
  const btnShowMyProfile = document.getElementById("btn-show-my-profile");
  const profileDetailsContainer = document.getElementById("profile-details-container");
  const userOverlayTitle = document.getElementById("user-overlay-title");
  const btnBackToUserOverlay = document.getElementById("btn-back-to-user-overlay");


  const btnMenu = document.getElementById("btn-menu");
  const burgerOverlay = document.getElementById("burger-overlay");
  const closeBurgerOverlay = document.getElementById("close-burger-overlay");
  const btnShowCampings = document.getElementById("btn-show-campings");
  const btnReserveCampings = document.getElementById("btn-reserve-campings");

  let isLoggedIn = false;

  const toggleHidden = (element) => {
    if (element) element.classList.toggle("hidden");
  };

  const resetLoginModal = () => {
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';
    if (loginMessage) loginMessage.textContent = '';
  };

  const showLoginModal = () => {
    if (modalLogin && modalLogin.classList.contains("hidden")) {
      toggleHidden(modalLogin);
    }
  };

  // Attachement des écouteurs d'événements
  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      if (isLoggedIn) {
        // Ouvrir l'overlay utilisateur et s'assurer que les options principales sont visibles
        userOverlay.classList.remove("hidden"); // S'assurer que l'overlay principal est visible
        userOverlayTitle.classList.remove("hidden");
        btnShowMyProfile.classList.remove("hidden");
        btnShowUserReservations.classList.remove("hidden");
        btnLogout.classList.remove("hidden");
        profileDetailsContainer.classList.add("hidden"); // S'assurer que le profil est masqué
      } else {
        showLoginModal();
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
      resetLoginModal(); // Réinitialiser le modal après fermeture
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
      !event.target.closest("#btn-login") &&
      !event.target.closest("#btn-show-my-profile") && // Empêche la fermeture si on clique sur "Voir mon profil"
      !event.target.closest("#profile-details-container") // Empêche la fermeture si on clique dans le profil
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
          // Ouvrir l'overlay utilisateur et s'assurer que les options principales sont visibles
          userOverlay.classList.remove("hidden"); 
          userOverlayTitle.classList.remove("hidden");
          btnShowMyProfile.classList.remove("hidden");
          btnShowUserReservations.classList.remove("hidden");
          btnLogout.classList.remove("hidden");
          profileDetailsContainer.classList.add("hidden"); // S'assurer que le profil est masqué
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
          // S'assurer que les options principales sont visibles et le profil masqué lors de la déconnexion
          userOverlayTitle.classList.remove("hidden");
          btnShowMyProfile.classList.remove("hidden");
          btnShowUserReservations.classList.remove("hidden");
          btnLogout.classList.remove("hidden");
          profileDetailsContainer.classList.add("hidden");
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
      history.pushState({ page: 'campings' }, '', '/campings');
      window.dispatchEvent(new Event('popstate'));
      toggleHidden(burgerOverlay); // Fermer le menu burger
    });
  }

  if (btnReserveCampings) {
    btnReserveCampings.addEventListener("click", (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        // The user should select a camping first from the campings list page.
        // So, this button should lead to the campings list, not directly to reservation.
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

  if (btnShowMyProfile) {
    btnShowMyProfile.addEventListener("click", async () => {
      if (profileDetailsContainer.classList.contains("hidden")) {
        // Masquer les éléments du menu principal
        userOverlayTitle.classList.add("hidden");
        btnShowMyProfile.classList.add("hidden");
        btnShowUserReservations.classList.add("hidden");
        btnLogout.classList.add("hidden");

        try {
          const response = await fetch('/Parc-National-AAA-/Backend/api/check-session.php');
          const result = await response.json();

          if (result.loggedIn && result.user) {
            profileDetailsContainer.innerHTML = `
              <p><strong>Prénom:</strong> ${result.user.first_name}</p>
              <p><strong>Nom:</strong> ${result.user.last_name}</p>
              <p><strong>Email:</strong> ${result.user.email}</p>
              <button id="btn-change-password" class="btn btn-secondary mt-3">Changer le mot de passe</button>
            `;
            profileDetailsContainer.classList.remove("hidden"); // Afficher les détails du profil

            // Ajouter le formulaire de changement de mot de passe (initiallement caché)
            const changePasswordFormContainer = document.createElement('div');
            changePasswordFormContainer.id = 'change-password-form-container';
            changePasswordFormContainer.classList.add('hidden'); // Masqué par défaut
            changePasswordFormContainer.innerHTML = `
              <h3>Changer votre mot de passe</h3>
              <form id="change-password-form">
                <div class="mb-3">
                  <label for="current-password" class="form-label">Mot de passe actuel</label>
                  <input type="password" class="form-control" id="current-password" required>
                </div>
                <div class="mb-3">
                  <label for="new-password" class="form-label">Nouveau mot de passe</label>
                  <input type="password" class="form-control" id="new-password" required>
                </div>
                <div class="mb-3">
                  <label for="confirm-new-password" class="form-label">Confirmer le nouveau mot de passe</label>
                  <input type="password" class="form-control" id="confirm-new-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Changer le mot de passe</button>
                <button type="button" id="btn-cancel-change-password" class="btn btn-secondary mt-2">Annuler</button>
                <p id="change-password-message" class="text-danger mt-2"></p>
              </form>
            `;
            profileDetailsContainer.appendChild(changePasswordFormContainer);

            const btnChangePassword = document.getElementById("btn-change-password");
            const btnCancelChangePassword = document.getElementById("btn-cancel-change-password");
            const changePasswordForm = document.getElementById("change-password-form");
            const changePasswordMessage = document.getElementById("change-password-message");

            if (btnChangePassword) {
              btnChangePassword.addEventListener("click", () => {
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(1)'));
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(2)'));
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(3)'));
                toggleHidden(btnChangePassword);
                changePasswordFormContainer.classList.remove('hidden');
              });
            }

            if (btnCancelChangePassword) {
              btnCancelChangePassword.addEventListener("click", () => {
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(1)'));
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(2)'));
                toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(3)'));
                toggleHidden(btnChangePassword);
                changePasswordFormContainer.classList.add('hidden');
                changePasswordForm.reset(); // Réinitialiser le formulaire
                changePasswordMessage.textContent = ''; // Effacer les messages
              });
            }

            if (changePasswordForm) {
              changePasswordForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                changePasswordMessage.textContent = '';

                const currentPassword = document.getElementById("current-password").value;
                const newPassword = document.getElementById("new-password").value;
                const confirmNewPassword = document.getElementById("confirm-new-password").value;

                if (newPassword !== confirmNewPassword) {
                  changePasswordMessage.textContent = "Les nouveaux mots de passe ne correspondent pas.";
                  return;
                }
                if (newPassword.length < 8) {
                  changePasswordMessage.textContent = "Le nouveau mot de passe doit contenir au moins 8 caractères.";
                  return;
                }

                try {
                  const response = await fetch('/Parc-National-AAA-/Backend/api/change-password.php', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
                  });

                  const result = await response.json();

                  if (response.ok && result.status === 'success') {
                    showToast("Mot de passe changé avec succès !", "success");
                    changePasswordForm.reset();
                    // Revenir à l'affichage des détails du profil après succès
                    toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(1)'));
                    toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(2)'));
                    toggleHidden(profileDetailsContainer.querySelector('p:nth-of-type(3)'));
                    toggleHidden(btnChangePassword);
                    changePasswordFormContainer.classList.add('hidden');
                  } else {
                    changePasswordMessage.textContent = result.message || "Erreur lors du changement de mot de passe.";
                    showToast(result.message || "Échec du changement de mot de passe.", "error");
                  }
                } catch (error) {
                  console.error("Error changing password:", error);
                  changePasswordMessage.textContent = "Une erreur est survenue lors du changement de mot de passe.";
                  showToast("Une erreur est survenue. Veuillez réessayer.", "error");
                }
              });
            }

          } else {
            showToast("Impossible de récupérer les informations de profil. Veuillez vous reconnecter.", "error");
            // En cas d'erreur, réafficher le menu principal
            userOverlayTitle.classList.remove("hidden");
            btnShowMyProfile.classList.remove("hidden");
            btnShowUserReservations.classList.remove("hidden");
            btnLogout.classList.remove("hidden");
          }
        } catch (error) {
          console.error("Error fetching profile details:", error);
          showToast("Une erreur est survenue lors de la récupération du profil.", "error");
          // En cas d'erreur, réafficher le menu principal
          userOverlayTitle.classList.remove("hidden");
          btnShowMyProfile.classList.remove("hidden");
          btnShowUserReservations.classList.remove("hidden");
          btnLogout.classList.remove("hidden");
        }
      } else {
        profileDetailsContainer.classList.add("hidden"); // Masquer les détails du profil
        // Réafficher les éléments du menu principal
        userOverlayTitle.classList.remove("hidden");
        btnShowMyProfile.classList.remove("hidden");
        btnShowUserReservations.classList.remove("hidden");
        btnLogout.classList.remove("hidden");
      }
    });
  }

  if (btnBackToUserOverlay) {
    btnBackToUserOverlay.addEventListener("click", () => {
      profileDetailsContainer.classList.add("hidden"); // Masquer les détails du profil
      userOverlayTitle.classList.remove("hidden");
      btnShowMyProfile.classList.remove("hidden");
      btnShowUserReservations.classList.remove("hidden");
      btnLogout.classList.remove("hidden");
    });
  }

  // Check session status on page load
  fetch('/Backend/api/check-session.php')
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
