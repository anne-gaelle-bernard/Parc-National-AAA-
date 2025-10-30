export const userService = {
  async login(email, password) {
    const response = await fetch('/Parc-National-AAA-/Backend/api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'Échec de la connexion');
    }
    return result;
  },

  async register(first_name, last_name, email, password) {
    const response = await fetch('/Parc-National-AAA-/Backend/api/register.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name, last_name, email, password })
    });
    const result = await response.json();
    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || "Échec de l'inscription");
    }
    return result;
  }
};