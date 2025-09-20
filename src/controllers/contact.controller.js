import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Contact } from '../models/contact.model.js';

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !message || !phone) {
      throw new ApiError(400, 'Name, email, and message are required');
    }

    // Create new contact entry
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, contact, 'Message sent successfully'));
  } catch (error) {
    console.error('Error in createContact:', error);

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

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if contact exists
  const contactToDelete = await Contact.findById(id);
  if (!contactToDelete) {
    throw new ApiError(404, 'Contact message not found');
  }

  // Delete contact from DB
  await Contact.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Contact message deleted successfully'));
});

const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });

  if (!contacts || contacts.length === 0) {
    throw new ApiError(404, 'No contact messages found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contacts },
        'Contact messages retrieved successfully'
      )
    );
});

export { createContact, deleteContact, getAllContacts };
