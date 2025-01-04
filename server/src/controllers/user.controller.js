import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Request } from '../models/request.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToS3 } from "../utils/uploadOnS3.js";
import { generateTokens } from "../utils/GenerateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, password } = req.body;
  if ([fullname, username, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }
  const existedUser = await User.findOne({
    username
  });
  if (existedUser)
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User with email or username exists"));
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath)
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Avatar is required"));
  const key = `profile/${username}`;
  // const avatar = await uploadToS3(avatarLocalPath, key);
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  if (!avatar)
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Avatar upload failed!"));
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong!"));
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Login users
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json(new ApiResponse(400, {}, "Username is required"));
  }

  const user = await User.findOne({
    username,
  });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid)
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Password is incorrect"));

  let accessToken, refreshToken;
  try {
    const tokens = await generateTokens(user._id);
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Error generating tokens: " + error.message)
      );
  }

  const loggendInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggendInUser,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Logout users
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const handleFriendRequest = asyncHandler(async (req, res) => {
  const { requestId, status } = req.body;

  if (!requestId || !status) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Request ID and status are required"));
  }

  if (!["accepted", "rejected"].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Invalid status value"));
  }

  const friendRequest = await Request.findById(requestId);

  if (!friendRequest) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Friend request not found"));
  }

  if (friendRequest.toUserId.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new ApiResponse(403, {}, "You are not authorized to handle this request"));
  }

  // Update the request status
  friendRequest.status = status;
  await friendRequest.save();

  if (status === "accepted") {
    // Add both users as friends
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { friends: friendRequest.fromUserId },
    });

    await User.findByIdAndUpdate(friendRequest.fromUserId, {
      $addToSet: { friends: req.user._id },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Friend request accepted and friend added"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request rejected"));
});

const getAllRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await Request.aggregate([
    { $match: { toUserId: userId } },

    {
      $lookup: {
        from: "users",
        localField: "fromUserId",
        foreignField: "_id",
        as: "fromUserDetails",
      },
    },

    { $unwind: "$fromUserDetails" },

    {
      $project: {
        _id: 1,
        status: 1,
        createdAt: 1,
        "fromUserDetails.username": 1,
        "fromUserDetails.fullname": 1,
        "fromUserDetails.avatar": 1,
      },
    },

    { $sort: { createdAt: -1 } },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { requests }, "Friend requests fetched successfully"));
});

const sendFriendRequest = asyncHandler(async (req, res) => {
  const { toUserId } = req.body;

  if (!toUserId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Recipient user ID is required"));
  }

  if (toUserId === req.user._id.toString()) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "You cannot send a friend request to yourself"));
  }

  // Check if the recipient user exists
  const recipientUser = await User.findById(toUserId);
  if (!recipientUser) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Recipient user not found"));
  }

  // Check if a friend request already exists
  const existingRequest = await Request.findOne({
    fromUserId: req.user._id,
    toUserId,
    status: "pending",
  });

  if (existingRequest) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Friend request already sent"));
  }

  // Create a new friend request
  const newRequest = new Request({
    fromUserId: req.user._id,
    toUserId,
    status: "pending",
  });

  await newRequest.save();

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Friend request sent successfully"));
});


export {
    registerUser,
    loginUser,
    logoutUser,
    handleFriendRequest,
    getAllRequests,
    sendFriendRequest
}