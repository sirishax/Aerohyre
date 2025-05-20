const request = require('supertest');
const app = require('../src/app');

describe('Booking API', () => {
    // Test creating a booking
    describe('POST /api/bookings', () => {
        test('Should create a new booking', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    roomId: '1',
                    startTime: '2024-01-20T10:00:00',
                    endTime: '2024-01-20T11:00:00'
                });
            
            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('id');
        });

        test('Should reject invalid time format', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    roomId: '1',
                    startTime: 'invalid-time',
                    endTime: '2024-01-20T11:00:00'
                });
            
            expect(response.statusCode).toBe(400);
        });

        test('Should reject when end time is before start time', async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    roomId: '1',
                    startTime: '2024-01-20T11:00:00',
                    endTime: '2024-01-20T10:00:00'
                });
            
            expect(response.statusCode).toBe(400);
        });
    });

    // Test getting available slots
    describe('GET /api/slots', () => {
        test('Should get available slots', async () => {
            const response = await request(app)
                .get('/api/slots')
                .query({ date: '2024-01-20' });

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });

        test('Should reject invalid date format', async () => {
            const response = await request(app)
                .get('/api/slots')
                .query({ date: 'invalid-date' });

            expect(response.statusCode).toBe(400);
        });
    });

    // Test updating a booking
    describe('PUT /api/bookings/:id', () => {
        let bookingId;

        beforeEach(async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    roomId: '1',
                    startTime: '2024-01-20T14:00:00',
                    endTime: '2024-01-20T15:00:00'
                });
            bookingId = response.body.id;
        });

        test('Should update existing booking', async () => {
            const response = await request(app)
                .put(`/api/bookings/${bookingId}`)
                .send({
                    startTime: '2024-01-20T16:00:00',
                    endTime: '2024-01-20T17:00:00'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(bookingId);
        });

        test('Should return 404 for non-existent booking', async () => {
            const response = await request(app)
                .put('/api/bookings/999999')
                .send({
                    startTime: '2024-01-20T16:00:00',
                    endTime: '2024-01-20T17:00:00'
                });

            expect(response.statusCode).toBe(404);
        });
    });

    // Test deleting a booking
    describe('DELETE /api/bookings/:id', () => {
        let bookingId;

        beforeEach(async () => {
            const response = await request(app)
                .post('/api/bookings')
                .send({
                    roomId: '1',
                    startTime: '2024-01-20T14:00:00',
                    endTime: '2024-01-20T15:00:00'
                });
            bookingId = response.body.id;
        });

        test('Should delete existing booking', async () => {
            const response = await request(app)
                .delete(`/api/bookings/${bookingId}`);
            
            expect(response.statusCode).toBe(204);
            
            // Verify booking is deleted
            const checkResponse = await request(app)
                .get(`/api/bookings/${bookingId}`);
            expect(checkResponse.statusCode).toBe(404);
        });

        test('Should return 404 for non-existent booking', async () => {
            const response = await request(app)
                .delete('/api/bookings/999999');

            expect(response.statusCode).toBe(404);
        });
    });
});