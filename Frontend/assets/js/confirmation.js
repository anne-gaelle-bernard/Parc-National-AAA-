document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  const reservationId = urlParams.get('reservation_id');
  const campingName = decodeURIComponent(urlParams.get('camping_name'));
  const checkInDate = urlParams.get('check_in_date');
  const checkOutDate = urlParams.get('check_out_date');
  const numberOfPersons = urlParams.get('number_of_persons');
  const totalPrice = urlParams.get('total_price');

  document.getElementById("reservation-id").textContent = reservationId;
  document.getElementById("camping-name").textContent = campingName;
  document.getElementById("check-in-date").textContent = checkInDate;
  document.getElementById("check-out-date").textContent = checkOutDate;
  document.getElementById("number-of-persons").textContent = numberOfPersons;
  document.getElementById("total-price").textContent = totalPrice;

  const cancelReservationBtn = document.getElementById("cancel-reservation-btn");
  if (cancelReservationBtn) {
    cancelReservationBtn.addEventListener("click", async () => {
      if (confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
        try {
          const response = await fetch("../../../Backend/api/reservations.php", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reservation_id: reservationId,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            alert("Réservation annulée avec succès !");
            window.location.href = "index.html"; // Rediriger vers l'accueil après annulation
          } else {
            alert(`Erreur lors de l'annulation: ${result.message}`);
          }
        } catch (error) {
          console.error("Erreur réseau ou du serveur:", error);
          alert("Une erreur est survenue lors de l'annulation. Veuillez réessayer.");
        }
      }
    });
  }

  const backToHomeBtn = document.getElementById("back-to-home-btn");
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
});
