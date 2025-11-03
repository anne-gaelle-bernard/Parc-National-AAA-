export const createResourcesPage = () => {
    const container = document.createElement('div');
    container.className = 'resources-page';
    container.innerHTML = `
        <div class="resources-header">
            <h1>🌿 Ressources Naturelles des Calanques</h1>
            <p class="resources-subtitle">Découvrez la biodiversité exceptionnelle du Parc National des Calanques de Marseille</p>
        </div>

        <div class="resources-intro">
            <div class="intro-card">
                <div class="intro-icon">🏞️</div>
                <p>Le Parc National des Calanques abrite une biodiversité remarquable, à la fois terrestre et marine. Situé entre Marseille et Cassis, ce territoire unique associe des paysages spectaculaires à une faune et une flore exceptionnelles.</p>
            </div>
        </div>

        <div class="resources-grid">
            <!-- Flore -->
            <div class="resource-category">
                <div class="category-header flora-header">
                    <h2>🌸 Flore Terrestre</h2>
                </div>
                <div class="resource-items">
                    <div class="resource-item">
                        <div class="resource-icon">🌲</div>
                        <h3>Pin d'Alep</h3>
                        <p>Arbre emblématique de la garrigue méditerranéenne, le pin d'Alep couvre de vastes étendues du parc. Très résistant à la sécheresse, il forme des forêts claires et lumineuses.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🌿</div>
                        <h3>Thym et Romarin</h3>
                        <p>Ces plantes aromatiques tapissent les collines et diffusent leurs parfums envoûtants. Elles sont adaptées au climat chaud et sec méditerranéen.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">💜</div>
                        <h3>Lavande Maritime</h3>
                        <p>Espèce protégée endémique, la lavande maritime fleurit sur les falaises et offre un spectacle violet magnifique au printemps.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🌺</div>
                        <h3>Orchidées Sauvages</h3>
                        <p>Plus de 50 espèces d'orchidées ont été recensées dans le parc, dont certaines sont rares et protégées. Elles fleurissent au printemps.</p>
                    </div>
                </div>
            </div>

            <!-- Faune Terrestre -->
            <div class="resource-category">
                <div class="category-header fauna-header">
                    <h2>🦎 Faune Terrestre</h2>
                </div>
                <div class="resource-items">
                    <div class="resource-item">
                        <div class="resource-icon">🦅</div>
                        <h3>Aigle de Bonelli</h3>
                        <p>Espèce rare et menacée, l'aigle de Bonelli niche dans les falaises des calanques. Le parc abrite plusieurs couples reproducteurs.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🦎</div>
                        <h3>Lézard Ocellé</h3>
                        <p>Le plus grand lézard d'Europe, reconnaissable à ses ocelles bleues. Il apprécie les zones rocailleuses et ensoleillées du parc.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🦊</div>
                        <h3>Renard Roux</h3>
                        <p>Discret habitant des calanques, le renard joue un rôle important dans la régulation des populations de rongeurs.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🦗</div>
                        <h3>Cigale</h3>
                        <p>Symbole de la Provence, les cigales chantent tout l'été dans les pins et les chênes. Plusieurs espèces cohabitent dans le parc.</p>
                    </div>
                </div>
            </div>

            <!-- Milieu Marin -->
            <div class="resource-category">
                <div class="category-header marine-header">
                    <h2>🌊 Milieu Marin</h2>
                </div>
                <div class="resource-items">
                    <div class="resource-item">
                        <div class="resource-icon">🐟</div>
                        <h3>Mérou Brun</h3>
                        <p>Poisson emblématique de la Méditerranée, le mérou peut atteindre 1,50 m. Protégé, il repeuple progressivement les eaux du parc.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🌱</div>
                        <h3>Herbiers de Posidonie</h3>
                        <p>Plante marine endémique de la Méditerranée, la posidonie forme de vastes prairies sous-marines essentielles à l'écosystème marin.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🐙</div>
                        <h3>Poulpe Commun</h3>
                        <p>Céphalopode intelligent et fascinant, le poulpe se camoufle remarquablement bien dans les rochers et les herbiers.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🦞</div>
                        <h3>Langouste Rouge</h3>
                        <p>Crustacé noble de la Méditerranée, la langouste rouge vit dans les cavités rocheuses. Sa pêche est strictement réglementée.</p>
                    </div>
                </div>
            </div>

            <!-- Géologie -->
            <div class="resource-category">
                <div class="category-header geology-header">
                    <h2>⛰️ Richesses Géologiques</h2>
                </div>
                <div class="resource-items">
                    <div class="resource-item">
                        <div class="resource-icon">🪨</div>
                        <h3>Calcaire Urgonien</h3>
                        <p>Roche calcaire blanche formée il y a 120 millions d'années, elle constitue les impressionnantes falaises des calanques.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">⛰️</div>
                        <h3>Calanques</h3>
                        <p>Vallées fluviales submergées formées lors de la dernière glaciation, elles créent des paysages spectaculaires entre terre et mer.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🏖️</div>
                        <h3>Plages de Galets</h3>
                        <p>Les plages du parc sont principalement constituées de galets polis par les vagues, témoins de l'érosion marine.</p>
                    </div>
                    <div class="resource-item">
                        <div class="resource-icon">🌋</div>
                        <h3>Grottes Marines</h3>
                        <p>L'érosion a creusé de nombreuses grottes dans les falaises calcaires, abritant une vie marine particulière.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-protection">
            <div class="protection-card">
                <h2>🛡️ Protection et Conservation</h2>
                <div class="protection-content">
                    <div class="protection-item">
                        <span class="protection-emoji">📜</span>
                        <p><strong>Parc National depuis 2012 :</strong> Le Parc National des Calanques est le 10ème parc national français et le premier parc national périurbain d'Europe.</p>
                    </div>
                    <div class="protection-item">
                        <span class="protection-emoji">⚠️</span>
                        <p><strong>Réglementation :</strong> Des règles strictes protègent les espèces et les milieux : interdiction de cueillette, circulation réglementée, zones de protection renforcée.</p>
                    </div>
                    <div class="protection-item">
                        <span class="protection-emoji">🔥</span>
                        <p><strong>Risque incendie :</strong> Le massif est très sensible au feu. L'accès peut être fermé en période de risque élevé pour préserver cet espace fragile.</p>
                    </div>
                    <div class="protection-item">
                        <span class="protection-emoji">🤝</span>
                        <p><strong>Visitez responsable :</strong> Restez sur les sentiers balisés, emportez vos déchets, respectez la tranquillité des animaux et ne prélevez rien.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="resources-actions">
            <button id="back-to-home-from-resources" class="action-button primary">
                🏠 Retour à l'accueil
            </button>
            <button id="view-map-from-resources" class="action-button secondary">
                🗺️ Voir la carte interactive
            </button>
        </div>
    `;

    return container;
};

export const setupResourcesPageLogic = (container) => {
    const backBtn = container.querySelector('#back-to-home-from-resources');
    const mapBtn = container.querySelector('#view-map-from-resources');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.pushState({ page: 'home' }, '', '/');
            window.dispatchEvent(new Event('popstate'));
        });
    }

    if (mapBtn) {
        mapBtn.addEventListener('click', () => {
            window.location.href = '/Parc-National-AAA-/map.html';
        });
    }
};
