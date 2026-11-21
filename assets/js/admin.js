// Get elements
const form = document.getElementById('adminForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleEye = document.getElementById('togglePassword');
const errorMsg = document.getElementById('errorMsg');

// Show / hide password
toggleEye.addEventListener('click', function () {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
  } else {
    passwordInput.type = 'password';
  }
});

// Form submit
form.addEventListener('submit', function (e) {
  e.preventDefault(); // stop page reload

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === '' || password === '') {
    errorMsg.textContent = 'Please fill in all fields.';
    return;
  }

  if (password.length < 6) {
    errorMsg.textContent = 'Password must be at least 6 characters.';
    return;
  }

  errorMsg.textContent = '';

  // Demo login (change this later with real backend check)
  if (email === 'admin@resource.com' && password === 'admin123') {
    alert('Login successful!');
    // window.location.href = 'pages/admin/dashboard.html';
  } else {
    errorMsg.textContent = 'Wrong email or password.';
  }
});
