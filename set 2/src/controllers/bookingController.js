const bookingStore = require('../models/bookingStore');

class BookingController {
    async createBooking(req, res) {
        try {
            const { roomId, startTime, endTime } = req.body;
            
            if (!roomId || !startTime || !endTime) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Validate time format
            const start = new Date(startTime);
            const end = new Date(endTime);
            
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid time format' });
            }

            // Validate end time is after start time
            if (end <= start) {
                return res.status(400).json({ error: 'End time must be after start time' });
            }

            const booking = await bookingStore.createBooking({ roomId, startTime, endTime });
            res.status(201).json(booking);
        } catch (error) {
            if (error.message === 'Booking conflict') {
                return res.status(409).json({ error: 'Time slot already booked' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async getAvailableSlots(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                return res.status(400).json({ error: 'Date parameter is required' });
            }

            // Validate date format
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: 'Invalid date format' });
            }
            
            const slots = await bookingStore.getAvailableSlots(date);
            res.json(slots);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const { startTime, endTime } = req.body;

            if (!startTime || !endTime) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const start = new Date(startTime);
            const end = new Date(endTime);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ error: 'Invalid time format' });
            }

            if (end <= start) {
                return res.status(400).json({ error: 'End time must be after start time' });
            }

            const booking = await bookingStore.updateBooking(id, { startTime, endTime });
            if (!booking) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            res.json(booking);
        } catch (error) {
            if (error.message === 'Booking conflict') {
                return res.status(409).json({ error: 'Time slot already booked' });
            }
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteBooking(req, res) {
        try {
            const { id } = req.params;
            const success = await bookingStore.deleteBooking(id);

            if (!success) {
                return res.status(404).json({ error: 'Booking not found' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new BookingController();