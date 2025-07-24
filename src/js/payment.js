// payment.js

document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('payment-form');
    const paymentButton = document.getElementById('pay-button');

    paymentButton.addEventListener('click', function(event) {
        event.preventDefault();
        processPayment();
    });

    function processPayment() {
        const amount = document.getElementById('amount').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!amount || !paymentMethod) {
            alert('Please fill in all fields.');
            return;
        }

        // Mock payment processing
        alert(`Processing payment of $${amount} using ${paymentMethod}...`);

        // Simulate successful payment
        setTimeout(() => {
            alert('Payment successful! Thank you for your transaction.');
            // Redirect to booking history or dashboard
            window.location.href = 'BookingHistory.html';
        }, 2000);
    }
});