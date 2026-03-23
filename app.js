const API = "https://script.google.com/macros/s/AKfycbwCqqrQtk-soz5L-YsVqNVD2AXFqZfEyO6mOpH4Vm__aWfNP3KiOQ7-xwgbhi8T_T2T/exec";

// Helper function for showing notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Helper function for showing loading state
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

function register(){
  const button = event.target;
  
  const role = document.getElementById('role').value.trim();
  const name = document.getElementById('name').value.trim();
  const department = document.getElementById('department').value.trim();
  const year = document.getElementById('year').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!role) { showNotification('Please select a role', 'error'); return; }
  if (!name)  { showNotification('Please enter your full name', 'error'); return; }
  if (!department) { showNotification('Please enter your department', 'error'); return; }
  if (role === 'Borrower' && !year) { showNotification('Please enter your year level', 'error'); return; }
  if (!contact) { showNotification('Please enter your contact number', 'error'); return; }
  if (!email)   { showNotification('Please enter your email', 'error'); return; }
  if (!password) { showNotification('Please enter your password', 'error'); return; }
  if (password.length < 6) { showNotification('Password must be at least 6 characters', 'error'); return; }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { showNotification('Please enter a valid email address', 'error'); return; }
  
  setLoading(button, true);
  
  fetch(API, {
    method: "POST",
    body: new URLSearchParams({ action:"register", role, name, department, year, contact, email, password })
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

function login(){
  const button = event.target;
  
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!email)    { showNotification('Please enter your email', 'error'); return; }
  if (!password) { showNotification('Please enter your password', 'error'); return; }
  
  setLoading(button, true);
  
  fetch(API, {
    method: "POST",
    body: new URLSearchParams({ action:"login", email, password })
  })
  .then(res => res.json())
  .then(data => {
    setLoading(button, false);
    if (data.status === "success") {
      localStorage.setItem("userID",   data.userID);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      showNotification('Login successful! Redirecting...', 'success');
      // Admin roles: Clinical Instructor OR Student Assistant → admin dashboard
      if (data.role === "Borrower") {
        setTimeout(() => window.location = "dashboard_borrower.html", 800);
      } else {
        setTimeout(() => window.location = "dashboard_admin.html", 800);
      }
    } else {
      showNotification(data.message || "Invalid email or password", 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Network error: ' + error.message, 'error');
  });
}

function logout() {
  localStorage.clear();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => window.location = 'login.html', 900);
}
