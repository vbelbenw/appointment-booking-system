const Slot = require('../models/Slot');

const db = require('../config/db');

const createSlot = async (req, res) => {
  try {
    const { date, start_time, end_time } = req.body;

    // 🔴 Basic validation
    if (!date || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate date format (basic check)
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Validate start_time and end_time (simple string comparison works for HH:mm / HH:mm:ss)
    if (start_time >= end_time) {
      return res.status(400).json({ success: false, message: "Start time must be less than end time" });
    }

    // 🔥 CHECK OVERLAPPING SLOTS
    const [existingSlots] = await db.execute(
      `SELECT * FROM slots 
       WHERE date = ? 
       AND (
         (? < end_time) AND (? > start_time)
       )`,
      [date, start_time, end_time]
    );

    if (existingSlots.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Slot overlaps with existing slot"
      });
    }

    const createdBy = req.user.userId || req.user.id;
    // ✅ INSERT SLOT
    await db.execute(
      `INSERT INTO slots (date, start_time, end_time, created_by)
       VALUES (?, ?, ?, ?)`,
      [date, start_time, end_time, createdBy]
    );

    res.status(201).json({ success: true, message: "Slot created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getSlots = async (req, res) => {
  try {
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

    // Fetch total number of slots
    const [[{ total }]] = await db.execute('SELECT COUNT(*) as total FROM slots');

    // Fetch paginated slots
    const [slots] = await db.execute(
      `SELECT * FROM slots ORDER BY date ASC, start_time ASC LIMIT ${limit} OFFSET ${offset}`
    );

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: slots
    });
  } catch (error) {
    console.error('Error in getSlots:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createSlot,
  getSlots
};
