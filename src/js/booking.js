// booking.js

// Mock data for service providers
const serviceProviders = [
    { id: 1, name: "John Doe", skill: "Plumber", mobile: "1234567890" },
    { id: 2, name: "Jane Smith", skill: "Electrician", mobile: "0987654321" },
    { id: 3, name: "Mike Johnson", skill: "Carpenter", mobile: "1122334455" }
];

// Function to search for service providers by skill
function searchServiceProviders(skill) {
    return serviceProviders.filter(provider => provider.skill.toLowerCase() === skill.toLowerCase());
}

// Function to create a booking request
function createBookingRequest(providerId, userId) {
    const provider = serviceProviders.find(p => p.id === providerId);
    if (provider) {
        // Here you would typically send the booking request to the backend
        console.log(`Booking request created for ${provider.name} by user ${userId}`);
        return true;
    }
    return false;
}

// Function to accept a booking request (for service providers)
function acceptBookingRequest(providerId, bookingId) {
    // Logic to accept the booking request
    console.log(`Provider ${providerId} accepted booking request ${bookingId}`);
}

// Exporting functions for use in other modules
export { searchServiceProviders, createBookingRequest, acceptBookingRequest };