// import { showToast } from './main.js'; // Importez showToast si nécessaire

export const createUserReservationsPage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Mes Réservations</h2>
        <p>Voici la liste de vos réservations passées et futures (logique à implémenter).</p>
        <button id="back-to-home-from-user-reservations-dynamic">Retour à l'accueil</button>
    `;
    container.querySelector('#back-to-home-from-user-reservations-dynamic').addEventListener('click', () => {
        history.pushState({ page: 'home' }, '', '/');
        window.dispatchEvent(new Event('popstate'));
    });
    return container;
};

export const setupUserReservationsPageLogic = (container) => {
    // Logic already attached during creation
};
