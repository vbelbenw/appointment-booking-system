const Slot = require('../models/Slot');

const createSlot = async (req, res) => {
  try {
    const { date, start_time, end_time } = req.body;

    if (!date || !start_time || !end_time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to database
    await Slot.createSlot(date, start_time, end_time);

    res.status(201).json({ message: 'Slot created successfully' });
  } catch (error) {
    console.error('Error in createSlot:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getSlots = async (req, res) => {
  try {
    // Return all slots
    const slots = await Slot.getAllSlots();
    res.status(200).json(slots);
  } catch (error) {
    console.error('Error in getSlots:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createSlot,
  getSlots
};
