class BookingStore {
    constructor() {
        this.bookings = new Map();
        this.lastId = 0;
    }

    generateId() {
        this.lastId += 1;
        return this.lastId.toString();
    }

    async createBooking({ roomId, startTime, endTime }) {
        const bookingTime = { start: new Date(startTime), end: new Date(endTime) };
        
        if (this.hasConflict(roomId, bookingTime, null)) {
            throw new Error('Booking conflict');
        }

        const id = this.generateId();
        const booking = {
            id,
            roomId,
            startTime: bookingTime.start,
            endTime: bookingTime.end
        };

        this.bookings.set(id, booking);
        return booking;
    }

    async updateBooking(id, { startTime, endTime }) {
        const booking = this.bookings.get(id);
        if (!booking) return null;

        const bookingTime = { start: new Date(startTime), end: new Date(endTime) };
        
        if (this.hasConflict(booking.roomId, bookingTime, id)) {
            throw new Error('Booking conflict');
        }

        const updatedBooking = {
            ...booking,
            startTime: bookingTime.start,
            endTime: bookingTime.end
        };

        this.bookings.set(id, updatedBooking);
        return updatedBooking;
    }

    async deleteBooking(id) {
        // Convert id to string to ensure consistent comparison
        id = id.toString();
        if (!this.bookings.has(id)) {
            return false;
        }
        return this.bookings.delete(id);
    }

    async getAvailableSlots(date) {
        const targetDate = new Date(date);
        const workingHours = {
            start: new Date(targetDate).setHours(9, 0, 0, 0),
            end: new Date(targetDate).setHours(17, 0, 0, 0)
        };

        const bookedSlots = Array.from(this.bookings.values())
            .filter(booking => {
                const bookingDate = new Date(booking.startTime).toDateString();
                return bookingDate === targetDate.toDateString();
            });

        const availableSlots = [];
        let currentTime = new Date(workingHours.start);

        while (currentTime < new Date(workingHours.end)) {
            const slotEnd = new Date(currentTime.getTime() + 60 * 60 * 1000); // 1 hour slots
            
            const isAvailable = !bookedSlots.some(booking => 
                booking.startTime < slotEnd && booking.endTime > currentTime
            );

            if (isAvailable) {
                availableSlots.push({
                    startTime: new Date(currentTime),
                    endTime: new Date(slotEnd)
                });
            }

            currentTime = slotEnd;
        }

        return availableSlots;
    }

    hasConflict(roomId, newBooking, excludeId = null) {
        for (const [id, booking] of this.bookings) {
            if (excludeId && id === excludeId) continue;
            if (booking.roomId !== roomId) continue;

            if (newBooking.start < booking.endTime && 
                newBooking.end > booking.startTime) {
                return true;
            }
        }
        return false;
    }
}

module.exports = new BookingStore();