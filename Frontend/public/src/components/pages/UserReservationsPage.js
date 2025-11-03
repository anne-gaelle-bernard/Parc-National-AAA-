import { showToast } from '../../../assets/js/uiManager.js';

export class UserReservationsPage {
    constructor(containerId, userId) {
        this.container = document.getElementById(containerId);
        this.userId = userId; // Assuming userId is passed from the main application
        this.render();
    }

    async fetchUserReservations() {
        try {
            const response = await fetch(`http://localhost/Parc-National-AAA-/Backend/api/reservations.php?user_id=${this.userId}`);
            const data = await response.json();
            if (response.ok) {
                return data; // This will be an array of reservations
            } else {
                console.error("Erreur lors de la récupération des réservations:", data.message);
                showToast(`Erreur: ${data.message}`, "error");
                return [];
            }
        } catch (error) {
            console.error("Erreur de réseau lors de la récupération des réservations:", error);
            showToast("Erreur de connexion au serveur lors de la récupération des réservations.", "error");
            return [];
        }
    }

    async cancelReservation(reservationId) {
        if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            return;
        }

        try {
            const response = await fetch('http://localhost/Parc-National-AAA-/Backend/api/reservations.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reservation_id: reservationId }),
            });

            const result = await response.json();

            if (response.ok) {
                showToast(`Réservation ${reservationId} annulée avec succès.`, "success");
                this.render(); // Re-render the page to update the list
            } else {
                showToast(`Erreur lors de l'annulation: ${result.message}`, "error");
            }
        } catch (error) {
            console.error("Erreur de réseau lors de l'annulation:", error);
            showToast("Erreur de connexion au serveur lors de l'annulation.", "error");
        }
    }

    async render() {
        this.container.innerHTML = '<p>Chargement de vos réservations...</p>';
        const reservations = await this.fetchUserReservations();

        if (reservations.length === 0) {
            this.container.innerHTML = '';
            return;
        }

        let reservationsHtml = reservations.map(reservation => `
            <div class="reservation-card">
                <h4>Réservation #${reservation.reservation_id}</h4>
                <p>Camping: ${reservation.camping_name}</p>
                <p>Emplacement: ${reservation.campsite_number}</p>
                <p>Arrivée: ${reservation.check_in_date}</p>
                <p>Départ: ${reservation.check_out_date}</p>
                <p>Prix total: ${reservation.total_price} €</p>
                <p>Statut: ${reservation.status}</p>
                ${reservation.status !== 'cancelled' ? `<button class="cancel-reservation-btn" data-reservation-id="${reservation.reservation_id}">Annuler la réservation</button>` : ''}
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="user-reservations-page">
                <h2>Mes Réservations</h2>
                <div class="reservations-list">
                    ${reservationsHtml}
                </div>
            </div>
        `;

        this.container.querySelectorAll('.cancel-reservation-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const reservationId = event.target.dataset.reservationId;
                this.cancelReservation(reservationId);
            });
        });
    }
}
