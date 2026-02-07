// ===== DOM ELEMENTS =====
const loginForm = document.getElementById('loginFormElement');
const forgotPasswordFormElement = document.getElementById('forgotPasswordFormElement');
const loginFormCard = document.getElementById('loginForm');
const forgotPasswordFormCard = document.getElementById('forgotPasswordForm');

// Inputs
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const resetEmailInput = document.getElementById('resetEmail');
const rememberMeCheckbox = document.getElementById('rememberMe');

// Buttons
const adminRoleBtn = document.getElementById('adminRoleBtn');
const userRoleBtn = document.getElementById('userRoleBtn');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const backToLoginBtn = document.getElementById('backToLogin');
const loginLoader = document.getElementById('loginLoader');
const loginBtnText = document.getElementById('loginBtnText');

// Toast
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');
const toastClose = document.getElementById('toastClose');

// ===== STATE MANAGEMENT =====
let selectedRole = 'admin'; // Default role
let isPasswordVisible = false;

// Demo credentials
const credentials = {
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator'
  },
  user: {
    username: 'user',
    password: 'user123',
    name: 'Juan Dela Cruz',
    role: 'User'
  }
};

// ===== UTILITY FUNCTIONS =====

// Show toast notification
function showToast(message, type = 'info') {
  toastMessage.textContent = message;
  toast.className = 'toast show ' + type;
  
  // Set icon based on type
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ️'
  };
  toastIcon.textContent = icons[type] || icons.info;
  
  // Auto hide after 4 seconds
  setTimeout(() => {
    hideToast();
  }, 4000);
}

// Hide toast
function hideToast() {
  toast.classList.remove('show');
}

// Store user session
function storeSession(userData) {
  const sessionData = {
    username: userData.username,
    name: userData.name,
    role: userData.role,
    loginTime: new Date().toISOString()
  };
  
  // Store in sessionStorage (temporary)
  sessionStorage.setItem('smartguide_user', JSON.stringify(sessionData));
  
  // If remember me is checked, store in localStorage (persistent)
  if (rememberMeCheckbox.checked) {
    localStorage.setItem('smartguide_user', JSON.stringify(sessionData));
    localStorage.setItem('smartguide_remember', 'true');
  }
}

// Check for existing session
function checkExistingSession() {
  const rememberMe = localStorage.getItem('smartguide_remember');
  const storedUser = rememberMe ? 
    localStorage.getItem('smartguide_user') : 
    sessionStorage.getItem('smartguide_user');
  
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      // Auto-redirect if session exists
      // showToast(`Welcome back, ${userData.name}!`, 'info');
      // Uncomment the line below to enable auto-redirect
      // setTimeout(() => redirectToDashboard(userData.role), 1000);
    } catch (e) {
      console.error('Error parsing stored user data:', e);
    }
  }
}

// Redirect to appropriate dashboard
function redirectToDashboard(role) {
  if (role === 'Administrator') {
    window.location.href = 'index.html'; // Admin dashboard
  } else {
    window.location.href = 'user-dashboard.html'; // User dashboard
  }
}

// Validate credentials
function validateCredentials(username, password, role) {
  const roleKey = role === 'admin' ? 'admin' : 'user';
  const validCreds = credentials[roleKey];
  
  return username === validCreds.username && password === validCreds.password;
}

// ===== EVENT HANDLERS =====

// Role selection
adminRoleBtn.addEventListener('click', () => {
  selectedRole = 'admin';
  adminRoleBtn.classList.add('active');
  userRoleBtn.classList.remove('active');
  
  // Update placeholder
  usernameInput.placeholder = 'Enter admin username';
});

userRoleBtn.addEventListener('click', () => {
  selectedRole = 'user';
  userRoleBtn.classList.add('active');
  adminRoleBtn.classList.remove('active');
  
  // Update placeholder
  usernameInput.placeholder = 'Enter user username';
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
  isPasswordVisible = !isPasswordVisible;
  passwordInput.type = isPasswordVisible ? 'text' : 'password';
  toggleIcon.textContent = isPasswordVisible ? '🙈' : '👁️';
});

// Switch to forgot password form
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginFormCard.classList.add('hidden');
  forgotPasswordFormCard.classList.remove('hidden');
});

// Back to login form
backToLoginBtn.addEventListener('click', () => {
  forgotPasswordFormCard.classList.add('hidden');
  loginFormCard.classList.remove('hidden');
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  // Validation
  if (!username || !password) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  // Show loading state
  loginForm.querySelector('.submit-btn').classList.add('loading');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validate credentials
  if (validateCredentials(username, password, selectedRole)) {
    const roleKey = selectedRole === 'admin' ? 'admin' : 'user';
    const userData = credentials[roleKey];
    
    // Store session
    storeSession(userData);
    
    // Show success message
    showToast(`Welcome, ${userData.name}!`, 'success');
    
    // Redirect after short delay
    setTimeout(() => {
      redirectToDashboard(userData.role);
    }, 1000);
    
  } else {
    // Show error message
    showToast('Invalid username or password', 'error');
    loginForm.querySelector('.submit-btn').classList.remove('loading');
    
    // Shake animation for inputs
    usernameInput.classList.add('shake');
    passwordInput.classList.add('shake');
    setTimeout(() => {
      usernameInput.classList.remove('shake');
      passwordInput.classList.remove('shake');
    }, 500);
  }
});

// Forgot password form submission
forgotPasswordFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = resetEmailInput.value.trim();
  
  if (!email) {
    showToast('Please enter your email address', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Show loading
  forgotPasswordFormElement.querySelector('.submit-btn').classList.add('loading');
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Success message
  showToast('Password reset link sent to your email!', 'success');
  
  // Reset form and go back to login
  resetEmailInput.value = '';
  forgotPasswordFormElement.querySelector('.submit-btn').classList.remove('loading');
  
  setTimeout(() => {
    backToLoginBtn.click();
  }, 2000);
});

// Toast close button
toastClose.addEventListener('click', hideToast);

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  // ESC to close toast
  if (e.key === 'Escape') {
    hideToast();
  }
});

// ===== INPUT ENHANCEMENTS =====

// Auto-focus on username input
window.addEventListener('load', () => {
  usernameInput.focus();
});

// Enter key to focus next field
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    passwordInput.focus();
  }
});

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  .shake {
    animation: shake 0.3s ease;
    border-color: var(--red) !important;
  }
`;
document.head.appendChild(style);

// ===== SECURITY FEATURES =====

// Prevent multiple rapid submissions
let isSubmitting = false;
loginForm.addEventListener('submit', () => {
  if (isSubmitting) return false;
  isSubmitting = true;
  setTimeout(() => isSubmitting = false, 2000);
});

// Clear password on page unload (security)
window.addEventListener('beforeunload', () => {
  if (!rememberMeCheckbox.checked) {
    passwordInput.value = '';
  }
});

// ===== DEMO CREDENTIALS QUICK FILL =====
document.querySelectorAll('.credential-box').forEach((box, index) => {
  box.style.cursor = 'pointer';
  box.title = 'Click to auto-fill';
  
  box.addEventListener('click', () => {
    if (index === 0) {
      // Admin credentials
      adminRoleBtn.click();
      usernameInput.value = 'admin';
      passwordInput.value = 'admin123';
    } else {
      // User credentials
      userRoleBtn.click();
      usernameInput.value = 'user';
      passwordInput.value = 'user123';
    }
    showToast('Demo credentials filled! Click Sign In.', 'info');
  });
});

// ===== INITIALIZE =====
function initializeLoginPage() {
  console.log('🔐 SmartGuide Login Page Initialized');
  console.log('📝 Demo credentials available');
  console.log('👨‍💼 Admin: admin / admin123');
  console.log('👤 User: user / user123');
  
  // Check for existing session
  checkExistingSession();
  
  // Show welcome message
  setTimeout(() => {
    showToast('Welcome to SmartGuide! Use demo credentials to login.', 'info');
  }, 500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLoginPage);
} else {
  initializeLoginPage();
}

// ===== LOGOUT FUNCTION (for use in dashboard) =====
function logout() {
  sessionStorage.removeItem('smartguide_user');
  localStorage.removeItem('smartguide_user');
  localStorage.removeItem('smartguide_remember');
  window.location.href = 'login.html';
}

// Make logout available globally
window.smartGuideLogout = logout;
