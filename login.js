const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Brian';

let mode = 'login';


let users = JSON.parse(localStorage.getItem('medical_users')) || [];

function handleSubmit(e) {
  e.preventDefault();
  clearMessages();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const name = document.getElementById('name').value.trim();

  if (mode === 'login') {
 
    const isAdmin = (email === ADMIN_EMAIL && password === ADMIN_PASSWORD);
    

    const existingUser = users.find(u => u.email === email && u.password === password);

if (isAdmin || existingUser) {

      const loggedInName = isAdmin ? 'Admin' : existingUser.name;
      localStorage.setItem('currentUser', loggedInName);


      showSuccess('Login successful! Redirecting...');
      

      setTimeout(() => {
        window.location.href = "/home.html"; 
      }, 1000);
      
    } else {
      showError('Invalid email or password. Please try again.');
    }
  } else {

    if (!name || !email || !password) {
      showError('Please fill in all fields.');
      return;
    }


    if (users.find(u => u.email === email) || email === ADMIN_EMAIL) {
      showError('This email is already registered.');
      return;
    }


    users.push({ name, email, password });
    localStorage.setItem('medical_users', JSON.stringify(users));

    showSuccess('Account created! Switching to login...');
    setTimeout(() => switchMode(), 1500);
  }
}

function switchMode() {
  clearMessages();

  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  document.getElementById('name').value = '';

  if (mode === 'login') {
    mode = 'signup';
    document.getElementById('form-title').textContent = 'Create an account';
    document.getElementById('form-subtitle').textContent = 'Sign up to get started today';
    document.getElementById('name-group').classList.remove('hidden');
    document.getElementById('submit-btn').textContent = 'Create Account';
    document.getElementById('switch-text').textContent = 'Already have an account?';
    document.getElementById('switch-btn-label').textContent = 'Sign in';
  } else {
    mode = 'login';
    document.getElementById('form-title').textContent = 'Welcome back';
    document.getElementById('form-subtitle').textContent = 'Sign in to your account to continue';
    document.getElementById('name-group').classList.add('hidden');
    document.getElementById('submit-btn').textContent = 'Sign In';
    document.getElementById('switch-text').textContent = "Don't have an account?";
    document.getElementById('switch-btn-label').textContent = 'Sign up';
  }
}

function togglePassword() {
  const input = document.getElementById('password');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function showSuccess(msg) {
  const el = document.getElementById('success-msg');
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function clearMessages() {
  const errorEl = document.getElementById('error-msg');
  const successEl = document.getElementById('success-msg');
  if (errorEl) errorEl.classList.add('hidden');
  if (successEl) successEl.classList.add('hidden');
}