const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bookingController.bookSlot);
router.get('/my', authMiddleware, bookingController.getMyBookings);

module.exports = router;
