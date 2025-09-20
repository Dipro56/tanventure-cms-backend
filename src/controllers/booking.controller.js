import { Booking } from '../models/booking.model.js';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// Create a new booking
const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, date, days, message, packageId, packageName } =
    req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !phone ||
    !date ||
    !days ||
    !packageId ||
    !packageName
  ) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  // Validate packageId format
  if (!mongoose.Types.ObjectId.isValid(packageId)) {
    throw new ApiError(400, 'Invalid package ID format');
  }

  // Create new booking
  const newBooking = new Booking({
    name,
    email,
    phone,
    date: new Date(date),
    days: parseInt(days),
    message: message || '',
    packageId,
    packageName,
  });

  // Save to database
  const savedBooking = await newBooking.save();

  // Populate virtual fields by converting to object
  const bookingObject = savedBooking.toObject();

  return res
    .status(201)
    .json(new ApiResponse(201, bookingObject, 'Booking created successfully'));
});

// Get all bookings with optional filtering
const getAllBookings = asyncHandler(async (req, res) => {
  const { email, packageId, status } = req.query;

  // Build filter object
  const filter = {};

  if (email) {
    filter.email = email.toLowerCase();
  }

  if (packageId && mongoose.Types.ObjectId.isValid(packageId)) {
    filter.packageId = packageId;
  }

  if (status) {
    filter.status = status;
  }

  // Execute query
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 }) // Sort by newest first
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, 'Bookings retrieved successfully'));
});

// Delete a booking by ID
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid booking ID format');
  }

  // Find and delete booking
  const deletedBooking = await Booking.findByIdAndDelete(id);

  if (!deletedBooking) {
    throw new ApiError(404, 'Booking not found');
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: deletedBooking._id,
        name: deletedBooking.name,
        email: deletedBooking.email,
      },
      'Booking deleted successfully'
    )
  );
});

export { createBooking, getAllBookings, deleteBooking };
