// import { showToast } from './main.js'; // Importez showToast si nécessaire

export const createCampingsListPage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Nos Campings</h2>
        <div id="campings-list-dynamic" class="grid-container"></div>
        <button id="back-to-home-from-campings-list-dynamic">Retour à l'accueil</button>
    `;
    const dynamicCampingsListContainer = container.querySelector('#campings-list-dynamic');

    // Fetch campings from backend
    fetch('/Parc-National-AAA-/Backend/api/get-campings.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.campings) {
                data.campings.forEach(camping => {
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
            } else {
                dynamicCampingsListContainer.innerHTML = "<p>Aucun camping trouvé.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching campings:", error);
            dynamicCampingsListContainer.innerHTML = "<p>Une erreur est survenue lors de la récupération des campings.</p>";
        });

    container.querySelector('#back-to-home-from-campings-list-dynamic').addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new Event('popstate'));
    });

    return container;
};

export const setupCampingsListPageLogic = (container) => {
    // Logic already attached during creation
};
