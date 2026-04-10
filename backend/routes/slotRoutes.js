const express = require('express');
const { createSlot, getSlots } = require('../controllers/slotController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// GET /api/slots (public or protected, making it public as per typical viewing requirements)
router.get('/', getSlots);

// POST /api/slots (protected, admin only)
router.post('/', authMiddleware, adminMiddleware, createSlot);

module.exports = router;
