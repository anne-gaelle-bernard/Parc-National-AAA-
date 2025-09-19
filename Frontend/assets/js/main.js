const init = () => {
  // --- Sélection des éléments DOM ---
  const btnLogin = document.getElementById("btn-login")
  const modalLogin = document.getElementById("modal-login")
  const loginMessage = document.getElementById("login-message")
  const loginEmail = document.getElementById("login-email")
  const loginPassword = document.getElementById("login-password")
  const btnLoginSubmit = document.getElementById("btn-login-submit")
  const switchToRegister = document.getElementById("switch-to-register")

  const modalRegister = document.getElementById("modal-register")
  const registerMessage = document.getElementById("register-message")
  const registerFirstName = document.getElementById("register-first-name")
  const registerLastName = document.getElementById("register-last-name")
  const registerEmail = document.getElementById("register-email")
  const registerPassword = document.getElementById("register-password")
  const btnRegisterSubmit = document.getElementById("btn-register-submit")
  const switchToLogin = document.getElementById("switch-to-login")

  const userOverlay = document.getElementById("user-overlay")
  const closeUserOverlay = document.getElementById("close-user-overlay")
  const btnLogout = document.getElementById("btn-logout")
  const btnShowUserReservations = document.getElementById("btn-show-user-reservations")

  const btnMenu = document.getElementById("btn-menu")
  const burgerOverlay = document.getElementById("burger-overlay")
  const closeBurgerOverlay = document.getElementById("close-burger-overlay")
  const btnShowCampings = document.getElementById("btn-show-campings")
  const btnReserveCampings = document.getElementById("btn-reserve-campings")

  const campingsListContainer = document.getElementById("campings-list-container")
  const campingDetailTitle = document.getElementById("camping-detail-title")
  const campingDetailImage = document.getElementById("camping-detail-image")
  const campingDetailDescription = document.getElementById("camping-detail-description")
  const reservationCampingsPageContainer = document.getElementById("reservation-campings-page-container")
  const campingDetailsView = document.getElementById("camping-details-view")
  const backToCampingsListBtn = document.getElementById("back-to-campings-list")
  const backToHomeFromCampingsListBtn = document.getElementById("back-to-home-from-campings-list")

  const userReservationsPageContainer = document.getElementById("user-reservations-page-container")

  const backToHomeFromCampingsList = document.getElementById("back-to-home-from-campings-list")
  const backToHomeFromUserReservations = document.getElementById("back-to-home-from-user-reservations")
  const backToCampingsList = document.getElementById("back-to-campings-list")

  const toastContainer = document.getElementById("toast-container")
  const mainContent = document.querySelector(".main-content")
  const cards = document.querySelectorAll(".card")

  // --- Variables d'état ---
  let isLoggedIn = false

  // --- Données (simulées) ---
  const campings = [
    {
      id: "sormiou",
      name: "Camping de SORMIOU",
      image: "Frontend/assets/img/Camping de SORMIOU.jpg", // Chemin corrigé
      description:
        "Découvrez le magnifique camping de Sormiou, idéalement situé près de la calanque. Profitez d'un cadre naturel exceptionnel pour vos vacances.",
    },
    {
      id: "morgiou",
      name: "Camping de MORGIOU",
      image: "Frontend/assets/img/Camping de MORGIOU.jpg", // Chemin corrigé
      description:
        "Le camping de Morgiou offre une vue imprenable sur la mer et un accès facile aux sentiers de randonnée. Parfait pour les amoureux de la nature.",
    },
    {
      id: "callelongue",
      name: "Camping de CALLELONGUE",
      image: "Frontend/assets/img/Camping de CALLELONGUE.jpg", // Chemin corrigé
      description:
        "Situé dans la charmante calanque de Callelongue, ce camping est un havre de paix. Idéal pour la détente et les activités nautiques.",
    },
  ]

  // --- Fonctions utilitaires ---
  const toggleHidden = (element) => {
    if (element) element.classList.toggle("hidden")
  }

  const showPage = (pageToShow) => {
    // Cacher toutes les pages secondaires et le contenu principal
    if (reservationCampingsPageContainer) reservationCampingsPageContainer.classList.add("hidden")
    if (campingDetailsView) campingDetailsView.classList.add("hidden")
    if (userReservationsPageContainer) userReservationsPageContainer.classList.add("hidden")
    if (mainContent) mainContent.classList.add("hidden")

    // Afficher la page demandée
    if (pageToShow) {
      pageToShow.classList.remove("hidden")
    } else {
      // Si aucune page n'est spécifiée, afficher le contenu principal
      if (mainContent) mainContent.classList.remove("hidden")
    }
  }

  const showToast = (message, type = "info") => {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type} p-3 rounded shadow-lg text-white`
    toast.textContent = message
    if (toastContainer) toastContainer.appendChild(toast)

    setTimeout(() => {
      if (toast) toast.remove()
    }, 3000)
  }

  const renderCampingsList = () => {
    console.log("[v0] Rendering campings list...")

    if (!campingsListContainer) {
      console.error("campingsListContainer non trouvé !")
      return
    }

    campingsListContainer.innerHTML = ""

    campings.forEach((camping) => {
      const campingCard = document.createElement("div")
      campingCard.className = "camping-card"
      campingCard.innerHTML = `
        <img src="${camping.image}" alt="${camping.name}" />
        <div class="card-text">${camping.name}</div>
      `

      campingCard.addEventListener("click", () => {
        console.log("[v0] Camping clicked:", camping.id)
        showCampingDetails(camping.id)
      })

      campingsListContainer.appendChild(campingCard)
    })

    console.log("[v0] Campings list rendered successfully")
  }

  const showCampingDetails = (campingId) => {
    console.log("[v0] Showing camping details for ID:", campingId)

    const camping = campings.find((c) => c.id === campingId)
    if (!camping) {
      console.error("Camping non trouvé !")
      return
    }

    // Masquer la liste des campings
    if (reservationCampingsPageContainer) {
      reservationCampingsPageContainer.classList.add("hidden")
    }

    // Afficher les détails du camping
    if (campingDetailsView) {
      campingDetailsView.classList.remove("hidden")
    }

    // Remplir les détails
    if (campingDetailTitle) campingDetailTitle.textContent = camping.name
    if (campingDetailImage) {
      campingDetailImage.src = camping.image
      campingDetailImage.alt = camping.name
    }
    if (campingDetailDescription) campingDetailDescription.textContent = camping.description

    console.log("[v0] Camping details displayed successfully")
  }

  const showCampingsPage = () => {
    console.log("[v0] Showing campings page...")

    // Masquer le contenu principal
    const mainContent = document.querySelector(".main-content")
    if (mainContent) {
      const cards = mainContent.querySelectorAll(".card")
      cards.forEach((card) => card.classList.add("hidden"))
    }

    // Afficher la page des campings
    if (reservationCampingsPageContainer) {
      reservationCampingsPageContainer.classList.remove("hidden")
      renderCampingsList()
    }

    console.log("[v0] Campings page displayed")
  }

  // --- Attachement des écouteurs d'événements ---

  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      if (isLoggedIn) {
        toggleHidden(userOverlay)
      } else {
        toggleHidden(modalLogin)
      }
    })
  }

  document.addEventListener("click", (event) => {
    if (
      modalLogin &&
      !modalLogin.classList.contains("hidden") &&
      !event.target.closest("#modal-login") &&
      !event.target.closest("#btn-login")
    ) {
      toggleHidden(modalLogin)
    }
    if (
      modalRegister &&
      !modalRegister.classList.contains("hidden") &&
      !event.target.closest("#modal-register") &&
      !event.target.closest("#switch-to-register")
    ) {
      toggleHidden(modalRegister)
    }
    if (
      userOverlay &&
      !userOverlay.classList.contains("hidden") &&
      !event.target.closest("#user-overlay") &&
      !event.target.closest("#btn-login")
    ) {
      toggleHidden(userOverlay)
    }
    if (
      burgerOverlay &&
      !burgerOverlay.classList.contains("hidden") &&
      !event.target.closest("#burger-overlay") &&
      !event.target.closest("#btn-menu")
    ) {
      toggleHidden(burgerOverlay)
    }
  })

  if (switchToRegister) {
    switchToRegister.addEventListener("click", () => {
      toggleHidden(modalLogin)
      toggleHidden(modalRegister)
    })
  }

  if (btnLoginSubmit) {
    btnLoginSubmit.addEventListener("click", () => {
      const email = loginEmail.value
      const password = loginPassword.value
      if (email === "test@example.com" && password === "password") {
        isLoggedIn = true
        toggleHidden(modalLogin)
        showToast("Connexion réussie !", "success")
        toggleHidden(userOverlay)
      } else {
        if (loginMessage) loginMessage.textContent = "Email ou mot de passe incorrect."
        showToast("Échec de la connexion.", "error")
      }
    })
  }

  if (switchToLogin) {
    switchToLogin.addEventListener("click", () => {
      toggleHidden(modalRegister)
      toggleHidden(modalLogin)
    })
  }

  if (btnRegisterSubmit) {
    btnRegisterSubmit.addEventListener("click", () => {
      const firstName = registerFirstName.value
      const lastName = registerLastName.value
      const email = registerEmail.value
      const password = registerPassword.value
      showToast("Inscription réussie ! Vous pouvez maintenant vous connecter.", "success")
      toggleHidden(modalRegister)
      toggleHidden(modalLogin)
    })
  }

  if (closeUserOverlay) {
    closeUserOverlay.addEventListener("click", () => {
      toggleHidden(userOverlay)
    })
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      isLoggedIn = false
      toggleHidden(userOverlay)
      showToast("Vous avez été déconnecté.", "info")
    })
  }

  if (btnMenu) {
    btnMenu.addEventListener("click", () => {
      toggleHidden(burgerOverlay)
    })
  }

  if (closeBurgerOverlay) {
    closeBurgerOverlay.addEventListener("click", () => {
      toggleHidden(burgerOverlay)
    })
  }

  if (btnShowCampings) {
    btnShowCampings.addEventListener("click", (e) => {
      e.preventDefault()
      showCampingsPage()
      toggleHidden(burgerOverlay)
    })
  }

  if (btnReserveCampings) {
    btnReserveCampings.addEventListener("click", (e) => {
      e.preventDefault()
      showToast("Afficher la page de réservation des campings.", "info")
      showCampingsPage()
      toggleHidden(burgerOverlay)
    })
  }

  if (btnShowUserReservations) {
    btnShowUserReservations.addEventListener("click", () => {
      showToast("Afficher mes réservations (logique à implémenter).", "info")
      showPage(userReservationsPageContainer)
      toggleHidden(userOverlay)
    })
  }

  if (cards) {
    cards.forEach((card, index) => {
      card.addEventListener("click", () => {
        if (index === 0) {
          showToast("Logique pour découvrir les parcs (à implémenter).", "info")
        } else if (index === 1) {
          showToast("Afficher la page de réservation des campings.", "info")
          showCampingsPage()
        }
      })
    })
  }

  if (backToHomeFromCampingsList) {
    backToHomeFromCampingsList.addEventListener("click", () => {
      showPage(null)
    })
  }

  if (backToHomeFromUserReservations) {
    backToHomeFromUserReservations.addEventListener("click", () => {
      showPage(null)
    })
  }

  if (backToCampingsList) {
    backToCampingsList.addEventListener("click", () => {
      showPage(reservationCampingsPageContainer)
      renderCampingsList()
    })
  }

  if (backToCampingsListBtn) {
    backToCampingsListBtn.addEventListener("click", () => {
      console.log("[v0] Back to campings list clicked")
      if (campingDetailsView) campingDetailsView.classList.add("hidden")
      if (reservationCampingsPageContainer) reservationCampingsPageContainer.classList.remove("hidden")
    })
  }

  if (backToHomeFromCampingsListBtn) {
    backToHomeFromCampingsListBtn.addEventListener("click", () => {
      console.log("[v0] Back to home clicked")
      if (reservationCampingsPageContainer) reservationCampingsPageContainer.classList.add("hidden")
      const mainContent = document.querySelector(".main-content")
      if (mainContent) {
        const cards = mainContent.querySelectorAll(".card")
        cards.forEach((card) => card.classList.remove("hidden"))
      }
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalLogin && !modalLogin.classList.contains("hidden")) {
        toggleHidden(modalLogin)
      }
      if (modalRegister && !modalRegister.classList.contains("hidden")) {
        toggleHidden(modalRegister)
      }
      if (userOverlay && !userOverlay.classList.contains("hidden")) {
        toggleHidden(userOverlay)
      }
      if (burgerOverlay && !burgerOverlay.classList.contains("hidden")) {
        toggleHidden(burgerOverlay)
      }

      if (campingDetailsView && !campingDetailsView.classList.contains("hidden")) {
        showPage(reservationCampingsPageContainer)
        renderCampingsList()
      } else if (reservationCampingsPageContainer && !reservationCampingsPageContainer.classList.contains("hidden")) {
        showPage(null)
      } else if (userReservationsPageContainer && !userReservationsPageContainer.classList.contains("hidden")) {
        showPage(null)
      }
    }
  })

  // --- Initialisation ---
  if (reservationCampingsPageContainer) reservationCampingsPageContainer.classList.add("hidden")
  if (campingDetailsView) campingDetailsView.classList.add("hidden")
  if (userReservationsPageContainer) userReservationsPageContainer.classList.add("hidden")
  if (mainContent) mainContent.classList.remove("hidden")
}

document.addEventListener("DOMContentLoaded", init)
