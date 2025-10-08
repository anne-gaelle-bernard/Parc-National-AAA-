export const createUserReservationsPage = () => {
    const container = document.createElement('div');
    container.id = 'user-reservations-page';
    container.innerHTML = `
        <div class="user-reservations-page">
            <h2>Mes Réservations</h2>
            <div id="reservations-list" class="reservations-list">
                <p>Chargement de vos réservations...</p>
            </div>
			<div id="reservations-message" class="reservations-message"></div>
			<div class="toolbar">
				<button id="refresh-reservations">Rafraîchir</button>
				<button id="back-to-home-from-user-reservations-dynamic">Retour à l'accueil</button>
			</div>
        </div>
    `;

    const backBtn = container.querySelector('#back-to-home-from-user-reservations-dynamic');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            history.pushState({ page: 'home' }, '', '/');
            window.dispatchEvent(new Event('popstate'));
        });
    }

    const refreshBtn = container.querySelector('#refresh-reservations');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const event = new CustomEvent('refresh-user-reservations');
            container.dispatchEvent(event);
        });
    }

    return container;
};

export const setupUserReservationsPageLogic = (container) => {
    const reservationsList = container.querySelector('#reservations-list');
    const reservationsMessage = container.querySelector('#reservations-message');

    const setMessage = (text, type = 'info') => {
        if (!reservationsMessage) return;
        reservationsMessage.textContent = text || '';
        reservationsMessage.className = `reservations-message ${type}`;
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            reservationsList.innerHTML = `<p>Chargement de vos réservations...</p>`;
            setMessage('');
        }
    };

    const renderReservations = (reservations) => {
        if (!reservations || reservations.length === 0) {
            reservationsList.innerHTML = `<p>Vous n'avez aucune réservation pour le moment.</p>`;
            setMessage('');
            return;
        }

        const cards = reservations.map((r) => `
            <div class="reservation-card">
                <h4>Réservation #${r.reservation_id}</h4>
                <p><strong>Camping:</strong> ${r.camping_name}</p>
                <p><strong>Emplacement:</strong> ${r.campsite_number}</p>
                <p><strong>Arrivée:</strong> ${r.check_in_date}</p>
                <p><strong>Départ:</strong> ${r.check_out_date}</p>
                <p><strong>Prix total:</strong> ${r.total_price} €</p>
                <p><strong>Statut:</strong> ${r.status}</p>
                ${r.status !== 'cancelled' ? `<button class="cancel-reservation-btn" data-reservation-id="${r.reservation_id}">Annuler la réservation</button>` : ''}
            </div>
        `).join('');

        reservationsList.innerHTML = cards;

        reservationsList.querySelectorAll('.cancel-reservation-btn').forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const reservationId = e.currentTarget.getAttribute('data-reservation-id');
                const confirmed = window.confirm('Confirmer l\'annulation de cette réservation ?');
                if (!confirmed) return;
                try {
                    const response = await fetch('/Parc-National-AAA-/Backend/api/reservations.php', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ reservation_id: reservationId })
                    });
                    const result = await response.json();
                    if (response.ok && result.status === 'success') {
                        // Refresh list after cancellation
                        await loadReservations();
                        setMessage('Réservation annulée avec succès.', 'success');
                    } else {
                        console.error(result.message || 'Erreur lors de l\'annulation');
                        setMessage(result.message || 'Erreur lors de l\'annulation.', 'error');
                    }
                } catch (err) {
                    console.error('Erreur réseau lors de l\'annulation', err);
                    setMessage('Erreur réseau lors de l\'annulation.', 'error');
                }
            });
        });
    };

    const loadReservations = async () => {
        setLoading(true);
        try {
            // Get current user from session to retrieve user_id
            const sessionRes = await fetch('/Parc-National-AAA-/Backend/api/check-session.php');
            const session = await sessionRes.json();
            if (!sessionRes.ok || !session.loggedIn || !session.user || !session.user.id) {
                reservationsList.innerHTML = `<p>Veuillez vous connecter pour voir vos réservations.</p>`;
                setMessage('Vous devez être connecté.', 'error');
                return;
            }

            const userId = session.user.id;
            const res = await fetch(`/Parc-National-AAA-/Backend/api/reservations.php?user_id=${encodeURIComponent(userId)}`);
            if (!res.ok) {
                reservationsList.innerHTML = `<p>Impossible de charger vos réservations pour le moment.</p>`;
                setMessage('Serveur indisponible. Réessayez plus tard.', 'error');
                return;
            }
            const reservations = await res.json();
            renderReservations(reservations);
            setMessage('');
        } catch (error) {
            console.error('Erreur lors du chargement des réservations', error);
            reservationsList.innerHTML = `<p>Une erreur est survenue. Veuillez réessayer plus tard.</p>`;
            setMessage('Une erreur est survenue lors du chargement.', 'error');
        }
    };

    loadReservations();

    // Support explicit refresh from toolbar
    container.addEventListener('refresh-user-reservations', () => {
        loadReservations();
    });
};
