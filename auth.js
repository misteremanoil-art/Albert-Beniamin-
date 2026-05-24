const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const accountStatus = document.getElementById('account-status');
const accountMessage = document.getElementById('account-message');
const logoutButton = document.getElementById('logout-button');

async function apiPost(path, data) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  });
  return response.json();
}

function showStatus(message, isError = false) {
  if (!accountStatus || !accountMessage) return;
  accountMessage.textContent = message;
  accountMessage.className = isError ? 'account-message error' : 'account-message success';
  accountStatus.hidden = false;
}

function hideStatus() {
  if (!accountStatus) return;
  accountStatus.hidden = true;
}

async function refreshUser() {
  try {
    const response = await fetch('/api/me', { credentials: 'same-origin' });
    if (!response.ok) {
      hideStatus();
      return;
    }
    const data = await response.json();
    showStatus(`Ești conectat ca ${data.name} (${data.email}).`, false);
  } catch (error) {
    hideStatus();
  }
}

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    const result = await apiPost('/api/register', { name, email, password });
    if (result.error) {
      showStatus(result.error, true);
      return;
    }
    showStatus(result.message || 'Cont creat cu succes.');
    form.reset();
    refreshUser();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value.trim();
    const password = form.password.value;

    const result = await apiPost('/api/login', { email, password });
    if (result.error) {
      showStatus(result.error, true);
      return;
    }
    showStatus(result.message || 'Autentificat cu succes.');
    form.reset();
    refreshUser();
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin'
    });
    const result = await response.json();
    showStatus(result.message || 'Deconectat.');
  });
}

refreshUser();
