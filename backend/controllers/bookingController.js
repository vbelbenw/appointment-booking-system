const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

const bookSlot = async (req, res) => {
  try {
    const { slot_id } = req.body;
    const user_id = req.user.userId || req.user.id;

    if (!slot_id) {
      return res.status(400).json({ message: 'Slot ID is required' });
    }

    // Check if slot exists
    const slot = await Slot.getSlotById(slot_id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check if slot is already booked
    if (slot.is_booked) {
      return res.status(400).json({ message: 'Slot is already booked' });
    }

    // Insert into bookings table
    await Booking.createBooking(user_id, slot_id);

    // Update slot is_booked = true
    await Slot.updateSlotStatus(slot_id, true);

    res.status(201).json({ message: 'Slot booked successfully' });
  } catch (error) {
    console.error('Error in bookSlot:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.userId || req.user.id;
    const bookings = await Booking.getUserBookings(user_id);
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in getMyBookings:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  bookSlot,
  getMyBookings
};
