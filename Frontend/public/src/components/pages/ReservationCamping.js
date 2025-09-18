import { CampingDetailsPage } from '/Parc-National-AAA-/Frontend/public/src/components/pages/CampingDetails.js';

export class ReservationCampingPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.render();
    }

    render() {
        console.log('Rendering ReservationCampingPage. Container:', this.container);
        this.container.classList.remove('hidden'); // Ensure the container itself is visible
        this.container.innerHTML = `
            <div class="reservation-campings-page">
                <h2>Nos Campings</h2>
                <div class="campings-list">
                    <div class="camping-card" data-camping-id="1">
                        <h3>Camping SORMIOU</h3>
                        <p>Description du Camping Sormiou...</p>
                        <button class="view-details-btn">Voir les détails et réserver</button>
                    </div>
                    <div class="camping-card" data-camping-id="2">
                        <h3>Camping MORGIOU</h3>
                        <p>Description du Camping Morgiou...</p>
                        <button class="view-details-btn">Voir les détails et réserver</button>
                    </div>
                    <div class="camping-card" data-camping-id="3">
                        <h3>Camping CALLELONGUE</h3>
                        <p>Description du Camping Callelongue...</p>
                        <button class="view-details-btn">Voir les détails et réserver</button>
                    </div>
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
