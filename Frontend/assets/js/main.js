let isLoggedIn = false;
let userData = null;

const modalLogin = document.getElementById('modal-login');
const modalRegister = document.getElementById('modal-register');
const userOverlay = document.getElementById('user-overlay');
const burgerOverlay = document.getElementById('burger-overlay');

document.querySelector('.logo').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Icône utilisateur
document.getElementById('btn-login').addEventListener('click', () => {
  if (isLoggedIn) {
    // Fermer menu burger s’il est ouvert
    if (!burgerOverlay.classList.contains('hidden')) {
      burgerOverlay.classList.add('hidden');
    }

    // Ouvrir overlay user
    userOverlay.classList.remove('hidden');
  } else {
    modalLogin.classList.remove('hidden');
  }
});

document.getElementById('btn-menu').addEventListener('click', () => {
  // Fermer overlay utilisateur si ouvert
  if (!userOverlay.classList.contains('hidden')) {
    userOverlay.classList.add('hidden');
  }

  // Fermer modale login si ouverte
  if (!modalLogin.classList.contains('hidden')) {
    modalLogin.classList.add('hidden');
  }

  // Fermer modale register si ouverte
  if (!modalRegister.classList.contains('hidden')) {
    modalRegister.classList.add('hidden');
  }

  // Ouvrir le menu burger
  burgerOverlay.classList.remove('hidden');
});




document.getElementById('close-user-overlay').addEventListener('click', () => {
  userOverlay.classList.add('hidden');
});
document.getElementById('close-burger-overlay').addEventListener('click', () => {
  burgerOverlay.classList.add('hidden');
});


document.getElementById('switch-to-register').addEventListener('click', () => {
  modalLogin.classList.add('hidden');
  modalRegister.classList.remove('hidden');
});

document.getElementById('switch-to-login').addEventListener('click', () => {
  modalRegister.classList.add('hidden');
  modalLogin.classList.remove('hidden');
});

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : "toast-error"}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slide-out 0.5s forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}


document.getElementById('btn-login-submit').addEventListener('click', () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  fetch('http://localhost/Parc-National-AAA-/Backend/api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
  if (data.status === 'success') {
    isLoggedIn = true;
    userData = data.user;
    modalLogin.classList.add('hidden');
    showToast(`Bienvenue ${userData.first_name} 👋`, "success");
  } else {
    showToast(data.message, "error");
  }
});

});


document.getElementById('btn-register-submit').addEventListener('click', () => {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const firstName = document.getElementById('register-first-name').value;
  const lastName = document.getElementById('register-last-name').value;

  fetch('http://localhost/Parc-National-AAA-/Backend/api/register.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName })
})
  .then(async res => {
    const text = await res.text();
    console.log("Réponse brute :", text); 
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Erreur de parsing JSON :", err);
      throw err;
    }
  })
  .then(data => {
  if (data.status === 'success') {
    showToast(data.message, "success");

    modalRegister.classList.add('hidden');
    modalLogin.classList.remove('hidden');
    showToast("Inscription réussie ! Connectez-vous 👌", "success");

    // vider le formulaire
    document.getElementById('register-email').value = "";
    document.getElementById('register-password').value = "";
    document.getElementById('register-first-name').value = "";
    document.getElementById('register-last-name').value = "";

  } else {
    showMessage("register-message", data.message, "error");
  }
});


});


document.getElementById('btn-logout').addEventListener('click', () => {
  fetch('http://localhost/Parc-National-AAA-/Backend/api/logout.php')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        showToast(data.message, "success");
        isLoggedIn = false;
        userData = null;
        userOverlay.classList.add('hidden');
      }
    });
});


window.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost/Parc-National-AAA-/Backend/api/check-session.php')
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        isLoggedIn = true;
        userData = data.user;
        console.log(`Connecté en tant que ${userData.first_name} ${userData.last_name}`);
      } else {
        isLoggedIn = false;
        userData = null;
      }
    });
});

// Fermer les modales manuellement
document.getElementById('close-login-modal').addEventListener('click', () => {
  modalLogin.classList.add('hidden');
});

document.getElementById('close-register-modal').addEventListener('click', () => {
  modalRegister.classList.add('hidden');
});
