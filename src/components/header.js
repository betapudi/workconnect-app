function initHeader() {
    // Set API base URL for Render or local
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3001'
        : 'https://workconnect-app.onrender.com';
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const profileLink = document.getElementById('profileLink');
    const editProfileLink = document.getElementById('editProfileLink');

    // Wait for header to load
    if (!settingsBtn || !settingsDropdown || !userNameDisplay || !profileLink || !editProfileLink) {
        setTimeout(initHeader, 50);
        return;
    }

    // Toggle settings dropdown
    settingsBtn.onclick = function (e) {
        e.stopPropagation();
        settingsDropdown.style.display = (settingsDropdown.style.display === "block") ? "none" : "block";
    };
    document.body.onclick = function () {
        settingsDropdown.style.display = "none";
    };

    // Set user info and links
    let userType = localStorage.getItem('userType');
    let userName = '';
    let mobile = '';
    if (userType === 'customer') {
        mobile = localStorage.getItem('customerMobile');
        fetch(`${API_BASE_URL}/api/customers/${mobile}`)
            .then(res => res.json())
            .then(data => {
                userName = data.name || '';
                userNameDisplay.textContent = userName;
                profileLink.textContent = userName || 'Profile';
            });
        profileLink.href = "CustomerProfile.html";
        editProfileLink.href = "CustomerProfile.html";
    } else if (userType === 'provider') {
        mobile = localStorage.getItem('providerMobile');
        fetch(`${API_BASE_URL}/api/providers/${mobile}`)
            .then(res => res.json())
            .then(data => {
                userName = data.name || '';
                userNameDisplay.textContent = userName;
                profileLink.textContent = userName || 'Profile';
            });
        profileLink.href = "ProviderProfile.html";
        editProfileLink.href = "ProviderProfile.html";
    } else {
        userNameDisplay.textContent = "Admin";
        profileLink.style.display = "none";
        editProfileLink.style.display = "none";
    }

    // Show Guest if not logged in
    if (!localStorage.getItem('userType')) {
        userNameDisplay.textContent = "Guest";
        profileLink.style.display = "none";
        editProfileLink.style.display = "none";
    }

    window.logout = function () {
        localStorage.clear();
        window.location.href = "Login.html";
    };
}

document.addEventListener('DOMContentLoaded', initHeader);