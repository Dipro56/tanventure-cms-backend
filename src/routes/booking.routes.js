import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';

import {
  createBooking,
  deleteBooking,
  getAllBookings,
} from '../controllers/booking.controller.js';

const router = Router();

// Review routes
router.route('/create-booking').post(createBooking);
router.route('/get-all-bookings').get(verifyJWT, getAllBookings);
router.route('/delete-booking/:id').delete(verifyJWT, deleteBooking);

export default router;
