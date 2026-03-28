const API = "https://script.google.com/macros/s/AKfycbyktlnQfWe8Sdu28ZPcfyG99YY31cChGvxUVGTpA0ARQPX31DddPC6nZIZQyPQMEsKD/exec";


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
    button.textContent = 'Loading...';
    button.style.opacity = '0.6';
  } else {
    button.disabled = false;
    button.textContent = button.getAttribute('data-original-text') || 'Submit';
    button.style.opacity = '1';
  }
}

function register(){
  const button = event.target;
  button.setAttribute('data-original-text', button.textContent);
  
  // Get all form fields
  const role = document.getElementById('role').value.trim();
  const name = document.getElementById('name').value.trim();
  const department = document.getElementById('department').value.trim();
  const year = document.getElementById('year').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Validation
  if (!role || role === '') {
    showNotification('Please select a role', 'error');
    return;
  }
  
  if (!name || name === '') {
    showNotification('Please enter your full name', 'error');
    return;
  }
  
  if (!department || department === '') {
    showNotification('Please enter your department', 'error');
    return;
  }
  
  if (!year || year === '') {
    showNotification('Please enter your year level', 'error');
    return;
  }
  
  if (!contact || contact === '') {
    showNotification('Please enter your contact number', 'error');
    return;
  }
  
  if (!email || email === '') {
    showNotification('Please enter your email', 'error');
    return;
  }
  
  if (!password || password === '') {
    showNotification('Please enter your password', 'error');
    return;
  }
  
  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  setLoading(button, true);
  
  fetch(API,{
    method:"POST",
    body:new URLSearchParams({
      action:"register",
      role:role,
      name:name,
      department:department,
      year:year,
      contact:contact,
      email:email,
      password:password
    })
  })
  .then(res => res.json())
  .then(data => {
    setLoading(button, false);
    if (data.status === 'success') {
      showNotification('Registration successful! Redirecting...', 'success');
      setTimeout(() => window.location = 'login.html', 1500);
    } else {
      showNotification(data.message || 'Registration failed', 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Error: ' + error.message, 'error');
  });
}

function login(){
  const button = event.target;
  button.setAttribute('data-original-text', button.textContent);
  
  // Get form fields
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Validation
  if (!email || email === '') {
    showNotification('Please enter your email', 'error');
    return;
  }
  
  if (!password || password === '') {
    showNotification('Please enter your password', 'error');
    return;
  }
  
  setLoading(button, true);
  
  fetch(API,{
    method:"POST",
    body:new URLSearchParams({
      action:"login",
      email:email,
      password:password
    })
  })
  .then(res=>res.json())
  .then(data=>{
    setLoading(button, false);
    if(data.status=="success"){
      localStorage.setItem("userID", data.userID);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      showNotification('Login successful!', 'success');
      if(data.role=="Student"){
        window.location="dashboard_student.html";
      }else{
        window.location="dashboard_ci.html";
      }
    }else{
      showNotification(data.message || "Invalid login", 'error');
    }
  })
  .catch(error => {
    setLoading(button, false);
    showNotification('Error: ' + error.message, 'error');
  });
}

function logout() {
  localStorage.clear();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => window.location = 'login.html', 1000);
}
