const pool = require('../config/db');

const Booking = {
  createBooking: async (user_id, slot_id) => {
    const [result] = await pool.execute(
      'INSERT INTO bookings (user_id, slot_id) VALUES (?, ?)',
      [user_id, slot_id]
    );
    return result;
  },

  getUserBookings: async (user_id) => {
    const [rows] = await pool.execute(
      `SELECT b.id as booking_id, s.date, s.start_time, s.end_time 
       FROM bookings b 
       JOIN slots s ON b.slot_id = s.id 
       WHERE b.user_id = ?`,
      [user_id]
    );
    return rows;
  }
};

module.exports = Booking;
