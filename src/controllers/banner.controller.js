import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Package } from '../models/package.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Banner } from '../models/banner.model.js';

const createBanner = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  console.log('req.body', req.body);

  try {
    // Check if a banner already exists
    let banner = await Banner.findOne({});

    let bannerImg;

    // Handle image upload if provided
    if (req.files && req.files.bannerImage) {
      const bannerImageLocalPath = req?.files?.bannerImage?.[0]?.path;

      if (bannerImageLocalPath) {
        bannerImg = await uploadOnCloudinary(bannerImageLocalPath);
        if (!bannerImg) {
          throw new ApiError(400, 'Failed to upload banner image');
        }
      }
    }

    if (banner) {
      // Update the existing banner
      banner.bannerTitle = title || banner.bannerTitle;
      banner.bannerDescription = description || banner.bannerDescription;

      // Only update the image if a new one was uploaded
      if (bannerImg?.url) {
        banner.bannerImage = bannerImg.url;
      }

      await banner.save();

      return res
        .status(200)
        .json(new ApiResponse(200, banner, 'Banner updated successfully'));
    } else {
      // Create new banner - ensure required fields are present
      if (!title || !description) {
        throw new ApiError(400, 'Banner name and description are required');
      }

      if (!bannerImg?.url) {
        throw new ApiError(400, 'Banner image is required');
      }

      banner = await Banner.create({
        bannerTitle: title,
        bannerImage: bannerImg.url,
        bannerDescription: description,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, banner, 'Banner created successfully'));
    }
  } catch (error) {
    console.error('Error in createBanner:', error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, {}, error.message));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, {}, 'Internal Server Error'));
  }
});

const getBannerDetails = asyncHandler(async (req, res) => {
  const bannerDetails = await Banner.findOne({});
  if (bannerDetails) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bannerDetails },
          `Banner details retrieved successfully`
        )
      );
  } else {
    throw new ApiError(400, 'No banner details found');
  }
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bannerName, bannerDescription } = req.body;

  // Check if package exists
  const bannerToUpdate = await Package.findById(id);

  if (!bannerToUpdate) {
    throw new ApiError(404, 'Package not found');
  }

  let avatar = bannerToUpdate.bannerImage;

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
    bannerName,
    bannerImage: avatar?.url,
    bannerDescription,
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

export { createBanner, getBannerDetails, updateBanner };
