import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating referesh and access token'
    );
  }
};

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, 'Username  & password both required'));
  }

  const existedUser = await User.findOne({ username: username });

  if (existedUser) {
    // const user = await User.findOne({ username: username });
    // console.log('user', user);
    const { accessToken } = await generateAccessAndRefereshTokens(
      existedUser._id
    );
    const loggedInUser = await User.findById(existedUser._id).select(
      '-createdAt -updatedAt -__v'
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return (
      res
        .status(200)
        .cookie('accessToken', accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
            },
            'User logged in Successfully'
          )
        )
    );
  } else {
    return res.status(400).json(new ApiResponse(400, {}, 'User not found'));
  }
});

export { login };
