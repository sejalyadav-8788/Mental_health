// Check if user is logged in when page loads
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    
    // If on index.html and not logged in, redirect to login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (!currentUser) {
            window.location.href = 'login.html';
        } else {
            displayWelcomeMessage(currentUser);
        }
    }
});

// Get current logged in user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Save user to localStorage
function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Remove user from localStorage
function removeUser() {
    localStorage.removeItem('currentUser');
}

// Display welcome message
function displayWelcomeMessage(user) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${user.username}! 👋`;
    }
}

// Handle Login Form Submit
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Disable button and show loading
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    
    try {
        // Call backend API
        const response = await fetch(`${CONFIG.API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            successMessage.textContent = 'Login successful! Redirecting...';
            successMessage.style.display = 'block';
            
            // Save user data
            saveUser(data);
            
            // Redirect to main page after 1 second
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            // Login failed
            errorMessage.textContent = data.error || 'Invalid username or password';
            errorMessage.style.display = 'block';
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Unable to connect to server. Please try again.';
        errorMessage.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}

// Handle Register Form Submit
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters long!';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Disable button and show loading
    registerBtn.disabled = true;
    registerBtn.textContent = 'Creating Account...';
    
    try {
        // Call backend API
        const response = await fetch(`${CONFIG.API_BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            successMessage.textContent = 'Account created successfully! Redirecting to login...';
            successMessage.style.display = 'block';
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } else {
            // Registration failed
            errorMessage.textContent = data.error || 'Registration failed. Please try again.';
            errorMessage.style.display = 'block';
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Account';
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        errorMessage.textContent = 'Unable to connect to server. Please try again.';
        errorMessage.style.display = 'block';
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
}

// Handle Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        removeUser();
        window.location.href = 'login.html';
    }
}