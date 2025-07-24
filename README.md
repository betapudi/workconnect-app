# Service Booking App

## Overview
The Service Booking App is a web application designed to connect customers with service providers such as plumbers, electricians, and other daily wage workers. The app allows users to register, search for services, book providers, and make payments seamlessly.

## Features
- **User Registration**: Customers can register using their mobile number and name.
- **Service Provider Registration**: Service providers can register with their mobile number, name, and skills.
- **Service Search**: Users can search for service providers based on specific skills.
- **Booking Requests**: Service providers can accept booking requests from users.
- **Payment Gateway**: Integrated payment options for secure transactions.
- **Responsive Design**: The app is designed to be mobile-friendly and accessible on various devices.

## Project Structure
```
service-booking-app
├── index.html
├── src
│   ├── assets
│   │   └── styles.css
│   ├── components
│   │   ├── CustomerRegister.html
│   │   ├── ProviderRegister.html
│   │   ├── Login.html
│   │   ├── ServiceSearch.html
│   │   ├── BookingRequest.html
│   │   ├── PaymentGateway.html
│   │   └── Navbar.html
│   ├── pages
│   │   ├── Home.html
│   │   ├── DashboardUser.html
│   │   ├── DashboardProvider.html
│   │   └── BookingHistory.html
│   ├── js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── payment.js
│   │   └── mockData.js
│   └── utils
│       └── helpers.js
├── package.json
└── README.md
```

## Technologies Used
- **HTML**: For structuring the web pages.
- **CSS**: For styling the application, utilizing Bootstrap for a modern UI.
- **JavaScript**: For implementing the application logic and interactivity.

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd service-booking-app
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Open `index.html` in your web browser to view the application.

## Usage
- Users can register as customers or service providers.
- Customers can search for service providers based on their required skills.
- Service providers can accept booking requests and manage their assignments.
- Users can make payments through the integrated payment gateway after the service is completed.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.