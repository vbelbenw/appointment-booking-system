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
  },

  getSlotById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM slots WHERE id = ?', [id]);
    return rows[0];
  },

  updateSlotStatus: async (id, is_booked) => {
    const [result] = await pool.execute(
      'UPDATE slots SET is_booked = ? WHERE id = ?',
      [is_booked, id]
    );
    return result;
  }
};

module.exports = Slot;
