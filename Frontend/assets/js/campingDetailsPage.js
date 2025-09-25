// import { showToast } from './main.js'; // Importez showToast si nécessaire

export const createCampingDetailsPage = (campingId) => {
    // Fetch camping details from backend
    fetch(`/Parc-National-AAA-/Backend/api/get-camping-details.php?id=${campingId}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.camping) {
                const camping = data.camping;
                const container = document.createElement('div');
                container.innerHTML = `
                    <button id="back-to-campings-list-dynamic">Retour à la liste des campings</button>
                    <h2 id="camping-detail-title-dynamic">${camping.name}</h2>
                    <img id="camping-detail-image-dynamic" src="${camping.image}" alt="${camping.name}" />
                    <p id="camping-detail-description-dynamic">${camping.description}</p>
                    <button id="reserve-this-camping-dynamic">Réserver ce camping</button>
                `;

                container.querySelector('#back-to-campings-list-dynamic').addEventListener('click', () => {
                    history.pushState({ page: 'campings' }, '', '/campings');
                    window.dispatchEvent(new Event('popstate'));
                });

                container.querySelector('#reserve-this-camping-dynamic').addEventListener('click', () => {
                    // Pass camping details to reservation page if needed
                    history.pushState({ page: 'reservation', campingId: camping.id, campingName: camping.name }, '', `/reservation?camping_id=${camping.id}&camping_name=${encodeURIComponent(camping.name)}`);
                    window.dispatchEvent(new Event('popstate'));
                });
                // mainContent.appendChild(container); // mainContent will be passed from router
                document.querySelector(".main-content").appendChild(container); // Temporarily use global mainContent

            } else {
                document.querySelector(".main-content").innerHTML = "<p>Camping non trouvé.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching camping details:", error);
            document.querySelector(".main-content").innerHTML = "<p>Une erreur est survenue lors de la récupération des détails du camping.</p>";
        });
};

export const setupCampingDetailsPageLogic = (container) => {
    // Logic already attached during creation
};
