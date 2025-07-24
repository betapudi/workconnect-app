// auth.js

// Register customer via API
async function registerCustomer(mobileNumber, name, role) {
    const res = await fetch('http://localhost:3001/api/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, name, role })
    });
    return await res.json();
}

// Register provider via API
async function registerProvider(mobileNumber, name, skills, location, taluk, district, state) {
    const res = await fetch('http://localhost:3001/api/register/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, name, skills, location, taluk, district, state })
    });
    return await res.json();
}

// Login via API
async function loginUser(mobileNumber, userType) {
    const res = await fetch('http://localhost:3001/api/login', {
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