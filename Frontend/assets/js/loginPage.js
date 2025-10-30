import { showToast } from './uiManager.js';
import { userService } from './userService.js';

export const createLoginPage = () => {
  const container = document.createElement('div');
  container.className = 'page login-page';
  container.innerHTML = `
    <h2>Se connecter</h2>
    <form id="login-form" class="form">
      <label>Email</label>
      <input type="email" id="login-email" required />
      <label>Mot de passe</label>
      <input type="password" id="login-password" required />
      <button type="submit" class="btn btn-primary">Connexion</button>
      <p class="form-message" id="login-message"></p>
      <p>Pas de compte ? <a href="/register" id="go-register">Créer un compte</a></p>
    </form>
  `;
  return container;
};

export const setupLoginPageLogic = (rootEl) => {
  const form = rootEl.querySelector('#login-form');
  const emailEl = rootEl.querySelector('#login-email');
  const pwdEl = rootEl.querySelector('#login-password');
  const msgEl = rootEl.querySelector('#login-message');
  const goRegister = rootEl.querySelector('#go-register');

  if (goRegister) {
    goRegister.addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState({ page: 'register' }, '', '/register');
      window.dispatchEvent(new Event('popstate'));
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msgEl.textContent = '';
      try {
        await userService.login(emailEl.value, pwdEl.value);
        showToast('Connexion réussie !', 'success');
        history.pushState({ page: 'campings' }, '', '/campings');
        window.dispatchEvent(new Event('popstate'));
      } catch (err) {
        msgEl.textContent = err.message;
        showToast(err.message, 'error');
      }
    });
  }
};