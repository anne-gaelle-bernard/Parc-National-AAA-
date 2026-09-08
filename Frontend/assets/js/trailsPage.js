export const createTrailsPage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Nos Sentiers</h2>
        <div id="trails-list-dynamic" class="grid-container"></div>
        <button id="back-to-home-from-trails">Retour à l'accueil</button>
    `;
    const dynamicTrailsContainer = container.querySelector('#trails-list-dynamic');

    fetch('/Parc-National-AAA-/Backend/api/trails.php')
        .then(response => response.json())
        .then(trails => {
            if (Array.isArray(trails) && trails.length > 0) {
                trails.forEach(trail => {
                    const trailCard = document.createElement("div");
                    trailCard.className = "camping-card";
                    const poiCount = Array.isArray(trail.points_of_interest) ? trail.points_of_interest.length : 0;
                    trailCard.innerHTML = `
                        <div class="card-text">${trail.name}</div>
                        <p>Difficulté : ${trail.difficulty}</p>
                        ${trail.estimated_duration ? `<p>Durée estimée : ${trail.estimated_duration}</p>` : ''}
                        ${trail.description ? `<p>${trail.description}</p>` : ''}
                        <p>${poiCount} point(s) d'intérêt</p>
                    `;
                    dynamicTrailsContainer.appendChild(trailCard);
                });
            } else {
                dynamicTrailsContainer.innerHTML = "<p>Aucun sentier trouvé.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching trails:", error);
            dynamicTrailsContainer.innerHTML = "<p>Une erreur est survenue lors de la récupération des sentiers.</p>";
        });

    container.querySelector('#back-to-home-from-trails').addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new Event('popstate'));
    });

    return container;
};

export const setupTrailsPageLogic = (container) => {
    // Logic already attached during creation
};
