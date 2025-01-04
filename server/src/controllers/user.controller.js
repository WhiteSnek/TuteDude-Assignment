import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToS3 } from "../utils/uploadOnS3.js";
import { generateTokens } from "../utils/GenerateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, password } = req.body;
  if ([fullname, username, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User with email or username exists"));
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath)
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Avatar are required"));
  const key = `profile/${username}`;
  const avatar = await uploadToS3(avatarLocalPath, key);
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

const addFriend = asyncHandler(async (req, res) => {
  const { friendId } = req.body;

  if (!friendId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Friend ID is required"));
  }

  const friendRequest = await Request.findOne({
    fromUserId: friendId,
    toUserId: req.user._id,
    status: "pending",
  });

  if (!friendRequest) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Friend request not found or already handled"));
  }

  friendRequest.status = "accepted";
  await friendRequest.save();

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { friends: friendId },
  });

  await User.findByIdAndUpdate(friendId, {
    $addToSet: { friends: req.user._id },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend added successfully"));
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

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fromUserId } = req.body;

  if (!fromUserId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is required"));
  }

  // Find the request and ensure the logged-in user is the recipient
  const friendRequest = await Request.findOne({
    fromUserId,
    toUserId: userId,
  });

  if (!friendRequest) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "Friend request not found or unauthorized"));
  }

  friendRequest.status = "rejected";
  await friendRequest.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request rejected successfully"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    addFriend,
    getAllRequests,
    rejectFriendRequest
}