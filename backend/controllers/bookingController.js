const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const db = require('../config/db');
const bookSlot = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const user_id = req.user.userId || req.user.id;

    if (!slot_id) {
      return res.status(400).json({ success: false, message: 'Slot ID is required' });
    }

    if (isNaN(slot_id)) {
      return res.status(400).json({ success: false, message: 'Slot ID must be a valid number' });
    }

    // Check if slot exists
    const slot = await Slot.getSlotById(slot_id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }

    // Check if slot is already booked
    if (slot.is_booked) {
      return res.status(400).json({ success: false, message: 'Slot is already booked' });
    }

    // Insert into bookings table
    await Booking.createBooking(user_id, slot_id);

    // Update slot is_booked = true
    await Slot.updateSlotStatus(slot_id, true);

    res.status(201).json({ success: true, message: 'Slot booked successfully' });
  } catch (error) {
    console.error('Error in bookSlot:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id || req.user.userId;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    if (isNaN(bookingId)) {
      return res.status(400).json({ success: false, message: 'Booking ID must be a valid number' });
    }

    // 🔍 Find booking
    const [bookings] = await db.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const booking = bookings[0];

    // ❌ Check ownership
    if (booking.user_id !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // 🔓 Free the slot
    await db.execute(
      "UPDATE slots SET is_booked = false WHERE id = ?",
      [booking.slot_id]
    );

    // 🗑 Delete booking
    await db.execute(
      "DELETE FROM bookings WHERE id = ?",
      [bookingId]
    );

    res.json({ success: true, message: "Booking cancelled successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.userId || req.user.id;
    let { page = 1, limit = 5 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters"
      });
    }

    const offset = (page - 1) * limit;

    // Fetch total number of bookings for logged-in user
    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?',
      [user_id]
    );

    // Fetch paginated bookings with JOINs
    const [bookings] = await db.execute(
      `SELECT b.id as booking_id, s.date, s.start_time, s.end_time 
       FROM bookings b 
       JOIN slots s ON b.slot_id = s.id 
       WHERE b.user_id = ? 
       ORDER BY s.date ASC, s.start_time ASC
       LIMIT ${limit} OFFSET ${offset}`,
      [user_id]
    );

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  bookSlot,
  getMyBookings,
  cancelBooking
};
