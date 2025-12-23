import { APIService } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
});

/**
 * Handles the Login form submission
 */
async function handleLoginSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors(e.target);

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button');

    // Validation
    let isValid = true;
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    }

    if (!isValid) return;

    try {
        setLoading(submitBtn, true, "Authenticating...");

        const response = await APIService.loginUser({ email, password });

        // FastAPI OAuth2 returns { access_token: "...", token_type: "bearer" }
        if (response.access_token) {
            // Store token and a dummy user object for UI
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('user', JSON.stringify({ username: email, email: email }));

            alert("Login successful!");
            window.location.href = 'dashboard.html';
        } else {
            throw new Error("Invalid response from server");
        }
    } catch (error) {
        alert("Login failed: " + error.message);
    } finally {
        setLoading(submitBtn, false, "Sign In");
    }
}

/**
 * Handles the Register form submission
 */
async function handleRegisterSubmit(e) {
    e.preventDefault();
    clearErrors(e.target);

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button');

    // Basic Validation
    let isValid = true;
    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    }
    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!isValid) return;

    try {
        setLoading(submitBtn, true, "Creating Account...");

        const response = await APIService.registerUser({ name, email, password });

        if (response) {
            alert("Account created successfully!");
            window.location.href = 'login.html';
        }
    } catch (error) {
        alert("Registration failed: " + error.message);
    } finally {
        setLoading(submitBtn, false, "Create Account");
    }
}

/**
 * Helper to show validation errors
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const group = field.closest('.form-group');
    if (group) {
        group.classList.add('error');
        const errorSpan = group.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.innerText = message;
        }
    }
}

/**
 * Helper to clear all errors in a form
 */
function clearErrors(form) {
    const groups = form.querySelectorAll('.form-group');
    groups.forEach(group => group.classList.remove('error'));
}

/**
 * Simple email validation regex
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Helper to handle button loading states
 */
function setLoading(btn, isLoading, text) {
    btn.disabled = isLoading;
    btn.innerText = text;
    btn.style.opacity = isLoading ? "0.7" : "1";
}
