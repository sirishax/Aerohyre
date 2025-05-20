const express = require('express');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(express.json());

// Add root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Conference Room Booking API',
        endpoints: {
            createBooking: 'POST /api/bookings',
            getAvailableSlots: 'GET /api/slots',
            updateBooking: 'PUT /api/bookings/:id',
            deleteBooking: 'DELETE /api/bookings/:id'
        }
    });
});

app.use('/api', bookingRoutes);

module.exports = app;