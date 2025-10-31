// import { showToast } from './main.js'; // Assuming showToast will be exported from main.js or a common utility file

export const createHomePage = () => {
    const container = document.createElement('div');
    container.innerHTML = `
        <section class="card">
            <img src="/Parc-National-AAA-/Frontend/assets/img/photo-parc.png" alt="Parc National" />
            <div class="card-text">Découvrir les Parcs Nationaux</div>
        </section>
        <section class="card">
            <img src="/Parc-National-AAA-/Frontend/assets/img/photo-parc2.png" alt="Réserver un parc" />
            <div class="card-text">Réserver</div>
        </section>
    `;

    container.querySelectorAll('.card').forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index === 0) {
                // Ouvrir la carte Leaflet (page autonome)
                window.location.href = '/Parc-National-AAA-/map.html';
            } else if (index === 1) {
                // Désactiver la redirection de la carte 'Réserver' pour n'utiliser que le lien du menu burger
                // history.pushState({ page: 'campings' }, '', '/campings');
                // window.dispatchEvent(new Event('popstate'));
            }
        });
    });
    return container;
};

export const setupHomePageLogic = (container) => {
    // No specific logic needed for home page for now other than card clicks
};
