import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user;
    if (decodedToken?._id) {
      user = await User.findById(decodedToken?._id).select(
        '-password -createdAt -updatedAt -__v'
      );
    }
    // else {
    //   user = await User.find({ phone: decodedToken?.phone });
    // }

    if (!user) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    console.log('authverifyuser', user);

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
