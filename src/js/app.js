document.addEventListener("DOMContentLoaded", function() {
    // Initialize the application
    initApp();

    function initApp() {
        // Load the home page by default
        loadPage('../../index.html');

        // Set up event listeners for navigation
        setupNavigation();
    }

    function setupNavigation() {
        const navLinks = document.querySelectorAll('nav a');

        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const page = this.getAttribute('href');
                loadPage(page);
            });
        });
    }

    function loadPage(page) {
        const content = document.getElementById('content');
        fetch(`src/pages/${page}`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
                // Call any additional initialization functions for the loaded page
                if (page === 'ServiceSearch.html') {
                    initServiceSearch();
                }
            })
            .catch(error => console.error('Error loading page:', error));
    }

    function initServiceSearch() {
        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('click', function() {
            const skill = document.getElementById('skillInput').value;
            searchServiceProviders(skill);
        });
    }

    function searchServiceProviders(skill) {
        // Mock function to simulate searching for service providers
        console.log(`Searching for service providers with skill: ${skill}`);
        // Here you would typically make an API call to fetch the service providers
    }
});