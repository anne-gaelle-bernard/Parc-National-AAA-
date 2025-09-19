document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const campingId = urlParams.get('camping_id');
  const campingName = urlParams.get('camping_name'); // Récupérer le nom du camping de l'URL
  console.log("Camping ID from URL:", campingId);
  console.log("Camping Name from URL:", campingName);

  const numCampsitesInput = document.getElementById("num-campsites")
  const numPeoplePerCampsiteInput = document.getElementById("num-people-per-campsite")
  const arrivalDateInput = document.getElementById("arrival-date")
  const departureDateInput = document.getElementById("departure-date")
  const totalPriceSpan = document.getElementById("total-price")
  const backToHomeButton = document.getElementById("back-to-home")
  const reservationForm = document.getElementById("camping-reservation-form")
  const campingNameDisplay = document.getElementById("camping-name-display")

  const PRICE_PER_PITCH_PER_NIGHT = 20; // Prix fixe par emplacement par nuit, comme demandé

  const calculateTotalPrice = () => {
    const numCampsites = parseInt(numCampsitesInput.value)
    const numPeople = parseInt(numPeoplePerCampsiteInput.value) // Ceci est le nombre de personnes *par emplacement*
    const arrivalDate = new Date(arrivalDateInput.value)
    const departureDate = new Date(departureDateInput.value)

    if (isNaN(numCampsites) || isNaN(numPeople) || !arrivalDateInput.value || !departureDateInput.value) {
      totalPriceSpan.textContent = "0"
      return
    }

    if (departureDate < arrivalDate) {
      totalPriceSpan.textContent = "Date de départ invalide"
      return
    }

    const timeDiff = Math.abs(departureDate.getTime() - arrivalDate.getTime())
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    if (diffDays === 0) {
        totalPriceSpan.textContent = "Date de départ invalide"
        return
    }
    
    // Calcul du prix basé sur le nombre d'emplacements, de nuits et le prix par emplacement par nuit
    const totalPrice = numCampsites * diffDays * PRICE_PER_PITCH_PER_NIGHT;
    totalPriceSpan.textContent = totalPrice.toString();
  }

  const initializeDateInputs = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayString = today.toISOString().split('T')[0];
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    arrivalDateInput.min = todayString;
    departureDateInput.min = tomorrowString;

    arrivalDateInput.value = todayString;
    departureDateInput.value = tomorrowString;
  };

  initializeDateInputs();
  calculateTotalPrice();

  // Fetch camping details and display name
  if (campingId) {
    if (campingName) {
      campingNameDisplay.textContent = `Réserver pour: ${decodeURIComponent(campingName)}`;
    } else {
      // Fallback: if name not in URL, fetch it
      fetch(`/Parc-National-AAA-/Backend/api/campings.php?id=${campingId}`)
        .then(response => response.json())
        .then(data => {
          if (data.camping_name) {
            campingNameDisplay.textContent = `Réserver pour: ${data.camping_name}`;
          } else {
            campingNameDisplay.textContent = "Réserver votre emplacement de camping";
          }
        })
        .catch(error => {
          console.error("Error fetching camping details:", error);
          campingNameDisplay.textContent = "Réserver votre emplacement de camping";
        });
    }
  } else {
    campingNameDisplay.textContent = "Réserver votre emplacement de camping";
  }

  numCampsitesInput.addEventListener("change", calculateTotalPrice)
  numPeoplePerCampsiteInput.addEventListener("change", calculateTotalPrice) // Toujours écouter pour le changement de personnes par emplacement
  arrivalDateInput.addEventListener("change", calculateTotalPrice)
  departureDateInput.addEventListener("change", calculateTotalPrice)

  backToHomeButton.addEventListener("click", () => {
    window.location.href = "/Parc-National-AAA-/index.html";
  })

  reservationForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const numCampsites = parseInt(numCampsitesInput.value)
    const numPeoplePerCampsite = parseInt(numPeoplePerCampsiteInput.value)
    const arrivalDate = arrivalDateInput.value
    const departureDate = departureDateInput.value
    const totalPrice = parseFloat(totalPriceSpan.textContent);

    // Basic validation (more comprehensive validation is done in calculateTotalPrice)
    if (new Date(departureDate) <= new Date(arrivalDate)) {
      alert("La date de départ doit être postérieure à la date d'arrivée.")
      return
    }

    // Validation for total persons (max 10 per pitch)
    if (numPeoplePerCampsite > 10) {
      alert("Le nombre de personnes par emplacement ne peut pas dépasser 10.");
      return;
    }

    // For now, assume a logged-in user with ID 1
    const userId = 1; 

    try {
      const response = await fetch("/Parc-National-AAA-/Backend/api/reservations.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          camping_id: campingId,
          check_in_date: arrivalDate,
          check_out_date: departureDate,
          number_of_pitches: numCampsites, // Nouveau champ
          number_of_persons_total: numPeoplePerCampsite // Nouveau champ: personnes par emplacement
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirection vers la page de confirmation avec les détails de la réservation
        const confirmationUrl = `/Parc-National-AAA-/Frontend/confirmation.html?` +
          `reservation_id=${result.reservation_ids[0]}&` + // Supposons qu'on affiche le premier ID de réservation pour l'instant
          `total_price=${totalPrice}&` +
          `camping_name=${encodeURIComponent(campingName || "Camping inconnu")}&` +
          `check_in_date=${arrivalDate}&` +
          `check_out_date=${departureDate}&` +
          `number_of_pitches=${numCampsites}&` +
          `number_of_persons_total=${numPeoplePerCampsite}`;

        window.location.href = confirmationUrl;
      } else {
        alert(`Erreur lors de la réservation: ${result.message}`)
      }
    } catch (error) {
      console.error("Erreur réseau ou du serveur:", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    }
  })
});
