function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    return phoneRegex.test(phoneNumber);
}

function validateName(name) {
    return name && name.trim().length > 0;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 16);
}

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

export {
    validatePhoneNumber,
    validateName,
    formatCurrency,
    generateUniqueId,
    debounce
};