import { showToast } from './uiManager.js';
import { userService } from '../../services/userService.js';

export const createRegisterPage = () => {
  const container = document.createElement('div');
  container.className = 'page register-page';
  container.innerHTML = `
    <h2>Créer un compte</h2>
    <form id="register-form" class="form">
      <label>Prénom</label>
      <input type="text" id="register-first-name" required />
      <label>Nom</label>
      <input type="text" id="register-last-name" required />
      <label>Email</label>
      <input type="email" id="register-email" required />
      <label>Mot de passe</label>
      <input type="password" id="register-password" required />
      <button type="submit" class="btn btn-primary">S'inscrire</button>
      <p class="form-message" id="register-message"></p>
      <p>Déjà inscrit ? <a href="/login" id="go-login">Se connecter</a></p>
    </form>
  `;
  return container;
};

export const setupRegisterPageLogic = (rootEl) => {
  const form = rootEl.querySelector('#register-form');
  const firstNameEl = rootEl.querySelector('#register-first-name');
  const lastNameEl = rootEl.querySelector('#register-last-name');
  const emailEl = rootEl.querySelector('#register-email');
  const pwdEl = rootEl.querySelector('#register-password');
  const msgEl = rootEl.querySelector('#register-message');
  const goLogin = rootEl.querySelector('#go-login');

  if (goLogin) {
    goLogin.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState({ page: 'login' }, '', '/login');
      window.dispatchEvent(new Event('popstate'));
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgEl.textContent = '';
      try {
        await userService.register(
          firstNameEl.value,
          lastNameEl.value,
          emailEl.value,
          pwdEl.value
        );
        showToast("Inscription réussie ! Vous pouvez maintenant vous connecter.", 'success');
        history.pushState({ page: 'login' }, '', '/login');
        window.dispatchEvent(new Event('popstate'));
      } catch (err) {
        msgEl.textContent = err.message;
        showToast(err.message, 'error');
      }
    });
  }
};