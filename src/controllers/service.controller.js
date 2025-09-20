import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Service } from '../models/service.model.js';

// Create new service
const createService = asyncHandler(async (req, res) => {
  const { title, description, type, order, isActive } = req.body;

  // Validate required fields
  if (!title || !description || !type) {
    throw new ApiError(400, 'Title, description and type are required');
  }

  // Create new service
  const service = await Service.create({
    title,
    description,
    type,
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, service, 'Service created successfully'));
});

// Get all services (active only by default)
const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find({});

  if (!services || services.length === 0) {
    throw new ApiError(404, 'No services found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { services }, 'Services retrieved successfully')
    );
});

// Update service
const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, type, order, isActive } = req.body;

  // Check if service exists
  const serviceToUpdate = await Service.findById(id);
  if (!serviceToUpdate) {
    throw new ApiError(404, 'Service not found');
  }

  // Build update object (only update provided fields)
  const updateData = {
    title: title !== undefined ? title : serviceToUpdate.title,
    description:
      description !== undefined ? description : serviceToUpdate.description,
    type: type !== undefined ? type : serviceToUpdate.type,
    order: order !== undefined ? order : serviceToUpdate.order,
    isActive: isActive !== undefined ? isActive : serviceToUpdate.isActive,
  };

  // Update service
  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedService) {
    throw new ApiError(500, 'Failed to update service');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedService, 'Service updated successfully'));
});

// Delete service
const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if service exists
  const serviceToDelete = await Service.findById(id);
  if (!serviceToDelete) {
    throw new ApiError(404, 'Service not found');
  }

  // Delete service from DB
  await Service.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Service deleted successfully'));
});

export { createService, getAllServices, updateService, deleteService };
