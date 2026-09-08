export const createResourcesPage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Ressources Naturelles</h2>
        <div id="resources-list-dynamic" class="grid-container"></div>
        <button id="back-to-home-from-resources">Retour à l'accueil</button>
    `;
    const dynamicResourcesContainer = container.querySelector('#resources-list-dynamic');

    fetch('/Parc-National-AAA-/Backend/api/resources.php')
        .then(response => response.json())
        .then(resources => {
            if (Array.isArray(resources) && resources.length > 0) {
                resources.forEach(resource => {
                    const resourceCard = document.createElement("div");
                    resourceCard.className = "camping-card";
                    resourceCard.innerHTML = `
                        <div class="card-text">${resource.species_name}</div>
                        <p>Type : ${resource.species_type === 'fauna' ? 'Faune' : 'Flore'}</p>
                        ${resource.location ? `<p>Localisation : ${resource.location}</p>` : ''}
                        ${resource.description ? `<p>${resource.description}</p>` : ''}
                    `;
                    dynamicResourcesContainer.appendChild(resourceCard);
                });
            } else {
                dynamicResourcesContainer.innerHTML = "<p>Aucune ressource naturelle trouvée.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching resources:", error);
            dynamicResourcesContainer.innerHTML = "<p>Une erreur est survenue lors de la récupération des ressources naturelles.</p>";
        });

    container.querySelector('#back-to-home-from-resources').addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new Event('popstate'));
    });

    return container;
};

export const setupResourcesPageLogic = (container) => {
    // Logic already attached during creation
};
