import { showToast } from '../../../assets/js/uiManager.js';

const getCampingImageUrl = (campingName) => {
    const images = {
        "Camping SORMIOU": "Frontend/assets/img/Camping de SORMIOU.jpg",
        "Camping MORGIOU": "Frontend/assets/img/Camping de MORGIOU.jpg",
        "Camping CALLELONGUE": "Frontend/assets/img/Camping de CALLELONGUE.jpg",
        // Ajoutez d'autres campings ici si nécessaire
    };
    return images[campingName] || null; // Retourne l'URL ou null si non trouvée
};

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

        const { name, description, campsites } = this.campingData; // Removed image_url
        const imageUrl = getCampingImageUrl(name);

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
                ${imageUrl ? `<img src="/Parc-National-AAA-/${imageUrl}" alt="Image de ${name}" class="camping-detail-image"/>` : ''} <!-- Added image display -->
                <h3>Emplacements disponibles:</h3>
                <div class="campsites-list">
                    ${campsitesHtml}
                </div>
                <button id="reserve-camping-button">Réserver ce camping</button>
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

        document.getElementById('reserve-camping-button').addEventListener('click', () => {
            window.location.href = `/Parc-National-AAA-/Frontend/reservation.html?camping_id=${this.campingId}&camping_name=${encodeURIComponent(name)}`;
        });
    }
}
