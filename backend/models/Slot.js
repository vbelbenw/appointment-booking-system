const pool = require('../config/db');

const Slot = {
  createSlot: async (date, start_time, end_time) => {
    const [result] = await pool.execute(
      'INSERT INTO slots (date, start_time, end_time) VALUES (?, ?, ?)',
      [date, start_time, end_time]
    );
    return result;
  },

  getAllSlots: async () => {
    const [rows] = await pool.execute('SELECT * FROM slots ORDER BY date ASC, start_time ASC');
    return rows;
  }
};

module.exports = Slot;
