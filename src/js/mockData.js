const mockData = {
    users: [
        {
            id: 1,
            name: "John Doe",
            mobile: "1234567890",
            role: "customer"
        },
        {
            id: 2,
            name: "Jane Smith",
            mobile: "0987654321",
            role: "customer"
        }
    ],
    serviceProviders: [
        {
            id: 1,
            name: "Mike Johnson",
            mobile: "1122334455",
            skills: ["plumbing", "electrical"],
            hourlyRate: 20,
            experience: "5 years",
            bio: "Experienced plumber and electrician with a passion for quality work."
        },
        {
            id: 2,
            name: "Emily Davis",
            mobile: "2233445566",
            skills: ["carpentry", "painting"],
            hourlyRate: 25,
            experience: "3 years",
            bio: "Skilled carpenter and painter, dedicated to customer satisfaction."
        }
    ],
    bookings: [
        {
            id: 1,
            userId: 1,
            providerId: 1,
            service: "plumbing",
            status: "completed",
            date: "2023-10-01",
            paymentStatus: "paid"
        },
        {
            id: 2,
            userId: 2,
            providerId: 2,
            service: "painting",
            status: "pending",
            date: "2023-10-02",
            paymentStatus: "unpaid"
        }
    ]
};

export default mockData;