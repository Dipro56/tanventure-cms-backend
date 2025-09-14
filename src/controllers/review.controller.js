import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Review } from '../models/review.model.js';

const createReview = asyncHandler(async (req, res) => {
  const { name, description, stars } = req.body;

  try {
    // Validate required fields
    if (!name || !description || !stars) {
      throw new ApiError(400, 'Name and description are required');
    }

    // Create new review
    const review = await Review.create({
      name,
      description,
      stars,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, review, 'Review created successfully'));
  } catch (error) {
    console.error('Error in createReview:', error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json(new ApiResponse(400, {}, errors.join(', ')));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Internal Server Error'));
  }
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if review exists
  const reviewToDelete = await Review.findById(id);
  if (!reviewToDelete) {
    throw new ApiError(404, 'Review not found');
  }

  // Delete review from DB
  await Review.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Review deleted successfully'));
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });

  if (!reviews || reviews.length === 0) {
    throw new ApiError(404, 'No reviews found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { reviews }, 'Reviews retrieved successfully'));
});

export { createReview, deleteReview, getAllReviews };
