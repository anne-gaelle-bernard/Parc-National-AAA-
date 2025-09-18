import { showToast } from '/Parc-National-AAA-/Frontend/assets/js/main.js';

export class CampingDetailsPage {
    constructor(containerId, campingId) {
        this.container = document.getElementById(containerId);
        this.campingId = campingId;
        this.campingData = null;
        this.render();
    }

    async fetchCampingDetails() {
        try {
            const response = await fetch(`http://localhost/Parc-National-AAA-/Backend/api/campings.php?id=${this.campingId}`);
            const data = await response.json();
            if (response.ok) {
                this.campingData = data;
            } else {
                console.error("Erreur lors de la récupération des détails du camping:", data.message);
                this.container.innerHTML = `<p>Erreur: ${data.message}</p>`;
            }
        } catch (error) {
            console.error("Erreur de réseau lors de la récupération des détails du camping:", error);
            this.container.innerHTML = `<p>Erreur de connexion au serveur.</p>`;
        }
    }

    async render() {
        this.container.innerHTML = '<p>Chargement des détails du camping...</p>';
        await this.fetchCampingDetails();

        if (!this.campingData) {
            return;
        }

        const { name, description, campsites } = this.campingData;

        let campsitesHtml = campsites.map(campsite => `
            <div class="campsite-card">
                <h4>Emplacement ${campsite.number}</h4>
                <p>Capacité maximale: ${campsite.max_capacity} personnes</p>
                <p>Prix par nuit et par personne: ${campsite.price_per_night} €</p>
                <form class="reservation-form" data-campsite-id="${campsite.id}">
                    <label for="check-in-${campsite.id}">Date d'arrivée:</label>
                    <input type="date" id="check-in-${campsite.id}" required>
                    <label for="check-out-${campsite.id}">Date de départ:</label>
                    <input type="date" id="check-out-${campsite.id}" required>
                    <label for="num-persons-${campsite.id}">Nombre de personnes (max ${campsite.max_capacity}):</label>
                    <input type="number" id="num-persons-${campsite.id}" min="1" max="${campsite.max_capacity}" value="1" required>
                    <p>Prix total estimé: <span class="total-price">0.00</span> €</p>
                    <button type="submit">Réserver cet emplacement</button>
                </form>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="camping-details-page">
                <button id="back-to-campings-list">Retour à la liste des campings</button>
                <h2>${name}</h2>
                <p>${description}</p>
                <h3>Emplacements disponibles:</h3>
                <div class="campsites-list">
                    ${campsitesHtml}
                </div>
            </div>
        `;

        document.getElementById('back-to-campings-list').addEventListener('click', () => {
            // Logic to go back to the list of campings
            const mainContent = document.querySelector('.main-content');
            const reservationCampingsPageContainer = document.getElementById('reservation-campings-page-container');
            
            this.container.classList.add('hidden'); // Hide details
            mainContent.classList.add('hidden'); // Keep main content hidden
            reservationCampingsPageContainer.classList.remove('hidden'); // Show campings list
            // Re-render the campings list to ensure it's fresh if needed
            // If ReservationCampingPage is still in memory, just show it. 
            // Otherwise, recreate it.
            // For now, we'll assume it's still there and just toggle visibility
        });

        this.container.querySelectorAll('.reservation-form').forEach(form => {
            const checkInInput = form.querySelector('input[type="date"][id^="check-in-"]');
            const checkOutInput = form.querySelector('input[type="date"][id^="check-out-"]');
            const numPersonsInput = form.querySelector('input[type="number"][id^="num-persons-"]');
            const totalPriceSpan = form.querySelector('.total-price');

            const calculatePrice = () => {
                const checkInDate = new Date(checkInInput.value);
                const checkOutDate = new Date(checkOutInput.value);
                const numPersons = parseInt(numPersonsInput.value);
                const pricePerNight = parseFloat(form.closest('.campsite-card').querySelector('p:nth-of-type(2)').textContent.split(': ')[1]);

                if (checkInDate && checkOutDate && numPersons > 0 && checkOutDate > checkInDate) {
                    const diffTime = Math.abs(checkOutDate - checkInDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const totalPrice = diffDays * pricePerNight * numPersons;
                    totalPriceSpan.textContent = totalPrice.toFixed(2);
                } else {
                    totalPriceSpan.textContent = "0.00";
                }
            };

            checkInInput.addEventListener('change', calculatePrice);
            checkOutInput.addEventListener('change', calculatePrice);
            numPersonsInput.addEventListener('change', calculatePrice);

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                // For now, assume a logged-in user with ID 1
                const userId = 1; 
                const campsiteId = form.dataset.campsiteId;
                const checkInDate = checkInInput.value;
                const checkOutDate = checkOutInput.value;
                const numberOfPersons = parseInt(numPersonsInput.value);

                const reservationData = {
                    user_id: userId,
                    campsite_id: campsiteId,
                    check_in_date: checkInDate,
                    check_out_date: checkOutDate,
                    number_of_persons: numberOfPersons
                };

                try {
                    const response = await fetch('http://localhost/Parc-National-AAA-/Backend/api/reservations.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reservationData),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        showToast(`Réservation confirmée pour ${result.total_price} € !`, "success");
                        // Clear form fields
                        checkInInput.value = '';
                        checkOutInput.value = '';
                        numPersonsInput.value = '1';
                        totalPriceSpan.textContent = "0.00";
                    } else {
                        showToast(`Erreur de réservation: ${result.message}`, "error");
                    }
                } catch (error) {
                    console.error("Erreur de réseau lors de la réservation:", error);
                    showToast("Erreur de connexion au serveur lors de la réservation.", "error");
                }
            });
        });
    }
}
