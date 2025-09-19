import { CampingDetailsPage } from '/Parc-National-AAA-/Frontend/public/src/components/pages/CampingDetails.js';

const getCampingImageUrl = (campingName) => {
    const images = {
        "Camping SORMIOU": "Frontend/assets/img/Camping de SORMIOU.jpg",
        "Camping MORGIOU": "Frontend/assets/img/Camping de MORGIOU.jpg",
        "Camping CALLELONGUE": "Frontend/assets/img/Camping de CALLELONGUE.jpg",
        // Ajoutez d'autres campings ici si nécessaire
    };
    return images[campingName] || null; // Retourne l'URL ou null si non trouvée
};

export class ReservationCampingPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    }

    async fetchCampings() {
        try {
            const response = await fetch('/Parc-National-AAA-/Backend/api/campings.php');
            const data = await response.json();
            if (response.ok) {
                return data; // This will be an array of campings
            } else {
                console.error("Erreur lors de la récupération des campings:", data.message);
                return [];
            }
        } catch (error) {
            console.error("Erreur de réseau lors de la récupération des campings:", error);
            return [];
        }
    }

    async render() {
        console.log('Rendering ReservationCampingPage. Container:', this.container);
        this.container.classList.remove('hidden'); // Ensure the container itself is visible
        this.container.innerHTML = '<p>Chargement des campings...</p>'; // Loading message

        const campings = await this.fetchCampings();

        if (campings.length === 0) {
            this.container.innerHTML = '<p>Aucun camping disponible pour le moment.</p>';
            return;
        }

        let campingsListHtml = campings.map(camping => {
            const imageUrl = getCampingImageUrl(camping.name);
            return `
            <div class="camping-card" data-camping-id="${camping.id}">
                ${imageUrl ? `<img src="/Parc-National-AAA-/${imageUrl}" alt="Image de ${camping.name}" />` : ''}
                <h3>${camping.name}</h3>
                <p>${camping.description}</p>
                <button class="view-details-btn" data-camping-name="${encodeURIComponent(camping.name)}">Voir les détails et réserver</button>
            </div>
        `;
        }).join('');

        this.container.innerHTML = `
            <div class="reservation-campings-page">
                <h2>Nos Campings</h2>
                <div class="campings-list grid-container">
                    ${campingsListHtml}
                </div>
            </div>
        `;

        this.container.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const campingId = event.target.closest('.camping-card').dataset.campingId;
                this.showCampingDetails(campingId);
            });
        });
    }

    showCampingDetails(campingId) {
        this.container.classList.add('hidden'); // Hide the list of campings
        const campingDetailsContainer = document.getElementById('camping-details-view');
        campingDetailsContainer.classList.remove('hidden'); // Show the details container
        new CampingDetailsPage('camping-details-view', campingId);
    }
}
