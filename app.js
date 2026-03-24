const API = "https://script.google.com/macros/s/AKfycbwCqqrQtk-soz5L-YsVqNVD2AXFqZfEyO6mOpH4Vm__aWfNP3KiOQ7-xwgbhi8T_T2T/exec";

// ── Notifications ─────────────────────────────────────────
function showNotification(message, type = 'info') {
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => n.classList.add('show'), 10);
  setTimeout(() => {
    n.classList.remove('show');
    setTimeout(() => n.remove(), 300);
  }, 3500);
}

// ── Loading State ─────────────────────────────────────────
function setLoading(button, isLoading) {
  if (isLoading) {
    button.disabled = true;
    button.setAttribute('data-original-text', button.textContent);
    button.textContent = 'Please wait...';
    button.style.opacity = '0.65';
  } else {
    button.disabled = false;
    button.textContent = button.getAttribute('data-original-text') || 'Submit';
    button.style.opacity = '1';
  }
}

// ── Register (Borrower only) ──────────────────────────────
function register() {
  const button = event.target;

  const name            = document.getElementById('name').value.trim();
  const department      = document.getElementById('department').value.trim();
  const year            = document.getElementById('year').value.trim();
  const contact         = document.getElementById('contact').value.trim();
  const email           = document.getElementById('email').value.trim();
  const password        = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Role is always Borrower for self-registration
  const role = 'Borrower';

  if (!name)       { showNotification('Please enter your full name', 'error'); return; }
  if (!department) { showNotification('Please enter your department/course', 'error'); return; }
  if (!year)       { showNotification('Please enter your year level', 'error'); return; }
  if (!contact)    { showNotification('Please enter your contact number', 'error'); return; }
  if (!email)      { showNotification('Please enter your school email', 'error'); return; }

  // Enforce school email domain
  if (!email.toLowerCase().endsWith('@gbox.ncf.edu.ph')) {
    showNotification('Email must use @gbox.ncf.edu.ph', 'error');
    return;
  }

  if (!password)            { showNotification('Please enter a password', 'error'); return; }
  if (password.length < 8)  { showNotification('Password must be at least 8 characters', 'error'); return; }
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }

  setLoading(button, true);

  fetch(API, {
    method: 'POST',
    body: new URLSearchParams({ action: 'register', role, name, department, year, contact, email, password })
  })
  .then(res => res.json())
  .then(data => {
    setLoading(button, false);
    if (data.status === 'success') {
      showNotification('Registration successful! Redirecting to login...', 'success');
      setTimeout(() => window.location = 'login.html', 1600);
    } else {
      showNotification(data.message || 'Registration failed', 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Network error: ' + error.message, 'error');
  });
}

// ── Login ─────────────────────────────────────────────────
function login() {
  const button = event.target;

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email)    { showNotification('Please enter your email', 'error'); return; }
  if (!password) { showNotification('Please enter your password', 'error'); return; }

  setLoading(button, true);

  fetch(API, {
    method: 'POST',
    body: new URLSearchParams({ action: 'login', email, password })
  })
  .then(res => res.json())
  .then(data => {
    setLoading(button, false);
    if (data.status === 'success') {
      localStorage.setItem('userID',   data.userID);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userRole', data.role);
      showNotification('Login successful! Redirecting...', 'success');
      // Admin roles: Clinical Instructor OR Student Assistant → admin dashboard
      if (data.role === 'Borrower') {
        setTimeout(() => window.location = 'dashboard_borrower.html', 800);
      } else {
        setTimeout(() => window.location = 'dashboard_admin.html', 800);
      }
    } else {
      showNotification(data.message || 'Invalid email or password', 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Network error: ' + error.message, 'error');
  });
}

// ── Logout ────────────────────────────────────────────────
function logout() {
  localStorage.clear();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => window.location = 'login.html', 900);
}
