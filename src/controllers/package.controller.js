import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Package } from '../models/package.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createPackage = asyncHandler(async (req, res) => {
  const { packagename, price, discount, duration, description, location } =
    req.body;

  let avatar;

  console.log('req.files', req.body, req?.files?.avatar?.[0]?.path);

  if (req.files && req.files.avatar) {
    const avatarLocalPath = req?.files?.avatar?.[0]?.path;

    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
      }
    }
  }

  const packageDetails = await Package.create({
    packagename,
    avatar: avatar?.url,
    price,
    discount,
    duration,
    description,
    location,
  });

  if (packageDetails) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { packageDetails },
          `Package created successfully  `
        )
      );
  } else {
    throw new ApiError(500, 'Something went wrong while creating package');
  }
});

const getPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find().sort({ createdAt: -1 });
  if (packages) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { packages }, `Packages retrieved successfully`)
      );
  } else {
    throw new ApiError(400, 'No packages found');
  }
});

const updatePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { packagename, price, discount, duration, description, location } =
    req.body;

  // Check if package exists
  const packageToUpdate = await Package.findById(id);

  if (!packageToUpdate) {
    throw new ApiError(404, 'Package not found');
  }

  // Start with the existing avatar - this will be kept if no new image is uploaded
  let avatar = packageToUpdate.avatar;

  // Handle new image upload ONLY if a file is provided
  if (req.files && req.files.avatar && req.files.avatar[0]) {
    const avatarLocalPath = req.files.avatar[0].path;

    if (avatarLocalPath) {
      const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
      if (!uploadedAvatar) {
        throw new ApiError(400, 'Failed to upload avatar');
      }
      // Only update the avatar if a new file was successfully uploaded
      avatar = uploadedAvatar.url;
    }
  }

  // Build update object with the new values or keep existing ones if not provided
  const updateData = {
    packagename: packagename || packageToUpdate.packagename,
    price: price || packageToUpdate.price,
    discount: discount !== undefined ? discount : packageToUpdate.discount,
    duration: duration || packageToUpdate.duration,
    description: description || packageToUpdate.description,
    location: location
      ? location.toLowerCase().trim()
      : packageToUpdate.location,
    avatar: avatar, // This will be either the existing or new avatar
  };

  // Update the package
  const updatedPackage = await Package.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    { new: true, runValidators: true } // Return updated document and run validators
  );

  if (!updatedPackage) {
    throw new ApiError(500, 'Failed to update package');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { updatedPackage }, 'Package updated successfully')
    );
});
const deletePackage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const packageToDelete = await Package.findById(id);

  if (!packageToDelete) {
    throw new ApiError(404, 'Package not found');
  }

  // Delete the package
  const deletedPackage = await Package.findByIdAndDelete(id);

  if (!deletedPackage) {
    throw new ApiError(500, 'Failed to delete package');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { deletedPackage }, 'Package deleted successfully')
    );
});

const getPackageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate if ID is provided
  if (!id) {
    throw new ApiError(400, 'Package ID is required');
  }

  // Check if package exists
  const packageById = await Package.findById(id);

  if (!packageById) {
    throw new ApiError(404, 'Package not found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { package: packageById },
        'Package retrieved successfully'
      )
    );
});

export {
  createPackage,
  getPackages,
  deletePackage,
  updatePackage,
  getPackageById,
};
