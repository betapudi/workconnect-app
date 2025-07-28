// auth.js

// Set API base URL for Render or local
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://workconnect-app.onrender.com';

// Register customer via API
async function registerCustomer(mobileNumber, name, role) {
    const res = await fetch(`${API_BASE_URL}/api/register/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, name, role })
    });
    return await res.json();
}

// Register provider via API
async function registerProvider(mobileNumber, name, skills, location, taluk, district, state) {
    const res = await fetch(`${API_BASE_URL}/api/register/provider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, name, skills, location, taluk, district, state })
    });
    return await res.json();
}

// Login via API
async function loginUser(mobileNumber, userType) {
    const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, userType })
    });
    return await res.json();
}

// Expose functions globally for HTML inline scripts
window.registerCustomer = registerCustomer;
window.registerProvider = registerProvider;
window.loginUser = loginUser;