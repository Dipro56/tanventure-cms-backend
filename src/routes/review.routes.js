import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createReview,
  deleteReview,
  getAllReviews,
} from '../controllers/review.controller.js';

const router = Router();

// Review routes
router.route('/create-review').post(createReview);
router.route('/get-all-reviews').get(getAllReviews);
router.route('/delete-review/:id').delete(verifyJWT, deleteReview);

export default router;
