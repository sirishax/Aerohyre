const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create a booking
router.post('/bookings', bookingController.createBooking.bind(bookingController));

// Get available slots
router.get('/slots', bookingController.getAvailableSlots.bind(bookingController));

// Update a booking
router.put('/bookings/:id', bookingController.updateBooking.bind(bookingController));

// Delete a booking
router.delete('/bookings/:id', bookingController.deleteBooking.bind(bookingController));

module.exports = router;