import { Information } from "../models/information.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// const createInfo = asyncHandler(async (req, res) => {
//   const { email, phone, address, instaLink, facebookLink, ticktokLink } =
//     req?.body;

//   // Check if any information already exists
//   const existingInfo = await Information.findOne({});
//   if (existingInfo) {
//     return res
//       .status(400)
//       .json(new ApiResponse(400, {}, 'Information already exists'));
//   }

//   try {
//     const infoCreate = await Information.create({
//       email,
//       phone,
//       address,
//       instaLink,
//       facebookLink,
//       ticktokLink,
//     });

//     const info = await Information.findById(infoCreate._id);

//     if (!info) {
//       throw new ApiError(500, 'Something went wrong while creating info');
//     }

//     return res
//       .status(200)
//       .json(new ApiResponse(200, info, 'Info created successfully'));
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(new ApiResponse(500, {}, 'Internal Server Error'));
//   }
// });

const createInfo = asyncHandler(async (req, res) => {
  const { email, phone, address, instaLink, facebookLink, ticktokLink } =
    req.body;

  try {
    // Check if the information already exists
    let info = await Information.findOne({});

    if (info) {
      // Update the existing information
      info.email = email || info.email;
      info.phone = phone || info.phone;
      info.address = address || info.address;
      info.instaLink = instaLink || info.instaLink;
      info.facebookLink = facebookLink || info.facebookLink;
      info.ticktokLink = ticktokLink || info.ticktokLink;
      await info.save();

      return res
        .status(200)
        .json(new ApiResponse(200, info, "Information updated successfully"));
    } else {
      // Create new information
      info = await Information.create({
        email,
        phone,
        address,
        instaLink,
        facebookLink,
        ticktokLink,
      });

      return res
        .status(201)
        .json(new ApiResponse(201, info, "Information created successfully"));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
});

const getInfo = asyncHandler(async (req, res) => {
  try {
    const info = await Information.findOne({});

    if (!info) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "No information found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, info, "Information retrieved successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal Server Error"));
  }
});

export { createInfo, getInfo };
