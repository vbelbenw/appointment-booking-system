const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { bookSlot, getMyBookings, cancelBooking } = require('../controllers/bookingController');
router.post('/', authMiddleware, bookingController.bookSlot);
router.get('/my', authMiddleware, bookingController.getMyBookings);
router.delete('/:id', authMiddleware, bookingController.cancelBooking);

module.exports = router;
