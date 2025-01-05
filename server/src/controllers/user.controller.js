import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// import { uploadToS3 } from "../utils/uploadOnS3.js";
import { generateTokens } from "../utils/GenerateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, password, interests } = req.body;

  // Check if all required fields are provided
  if ([fullname, username, password].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  // Validate interests to ensure it's an array of strings
  if (interests && !Array.isArray(interests)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Interests must be an array of strings"));
  }

  // Check if the user already exists
  const existedUser = await User.findOne({
    username,
  });
  if (existedUser)
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "User with email or username exists"));

  // Handle avatar upload
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath)
    return res.status(400).json(new ApiResponse(400, {}, "Avatar is required"));

  const key = `profile/${username}`;
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Avatar upload failed!"));

  // Create the user with interests and other data
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    password,
    username: username.toLowerCase(),
    interests: interests || [],  // Default to an empty array if no interests are provided
  });

  // Fetch the created user without sensitive fields
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
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Username is required"));
  }

  const user = await User.findOne({
    username,
  });
  console.log(user)
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

  const loggendInUser = await User.findById(user._id).select(
    "-password -refreshToken -friends -interests -createdAt -updatedAt"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggendInUser, "User logged in successfully"));
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

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken -friends -interests -createdAt -updatedAt"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
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
      .json(
        new ApiResponse(
          403,
          {},
          "You are not authorized to handle this request"
        )
      );
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
      .json(
        new ApiResponse(200, {}, "Friend request accepted and friend added")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Friend request rejected"));
});

const getAllRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await Request.aggregate([
    { $match: { toUserId: userId, status: "pending" } },

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
    .json(
      new ApiResponse(200, requests, "Friend requests fetched successfully")
    );
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
      .json(
        new ApiResponse(400, {}, "You cannot send a friend request to yourself")
      );
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

const getFriends = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
    },
    {
      $lookup: {
        from: "users",
        localField: "friends",
        foreignField: "_id",
        as: "friendsDetails",
      },
    },
    {
      $unwind: "$friendsDetails",
    },
    {
      $project: {
        "friendsDetails._id": 1,
        "friendsDetails.fullname": 1,
        "friendsDetails.avatar": 1,
        "friendsDetails.username": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        friends: { $push: "$friendsDetails" },
      },
    },
  ]);

  if (!user || user.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "User has no friends"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0].friends, "Friends retrieved successfully")
    );
});

const getRecommendedPeople = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("friends");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const recommendedPeople = await User.aggregate([
    {
      $match: {
        _id: {
          $nin: user.friends.map((friend) => friend._id),
          $ne: new mongoose.Types.ObjectId(req.user._id),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "friends",
        foreignField: "_id",
        as: "friendsDetails",
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        avatar: 1,
        interests: 1,
        friends: 1,
        friendsDetails: 1,
      },
    },
    {
      $addFields: {
        mutualFriends: {
          $size: {
            $setIntersection: [
              "$friends", // The friends of the current user in the pipeline (array of ObjectIds)
              user.friends.map((friend) => friend._id), // The friends of the logged-in user (array of ObjectIds)
            ],
          },
        },
        commonInterests: {
          $size: {
            $setIntersection: ["$interests", user.interests],
          },
        },
      },
    },
    {
      $match: {
        $or: [{ mutualFriends: { $gte: 1 } }, { commonInterests: { $gte: 1 } }],
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        avatar: 1,
        mutualFriends: 1,
        commonInterests: 1,
        friendsDetails: 1,
      },
    },
    {
      $addFields: {
        reason: {
          $cond: {
            if: { $gt: ["$mutualFriends", 0] },
            then: {
              $concat: [
                "You both have mutual friends: ",
                {
                  $reduce: {
                    input: "$friendsDetails",
                    initialValue: "",
                    in: {
                      $cond: {
                        if: {
                          $in: [
                            "$$this._id",
                            user.friends.map((friend) => friend._id),
                          ],
                        },
                        then: {
                          $concat: [
                            "$$value",
                            "$$this.fullname",
                            ", ", // Add a separator between names
                          ],
                        },
                        else: "$$value",
                      },
                    },
                  },
                },
              ],
            },
            else: {
              $cond: {
                if: { $gt: ["$commonInterests", 0] },
                then: {
                  $concat: [
                    "You both share common interests in: ",
                    {
                      $reduce: {
                        input: "$interests",
                        initialValue: "",
                        in: {
                          $cond: {
                            if: { $ne: ["$$this", ""] },
                            then: {
                              $concat: ["$$value", "$$this", ", "],
                            },
                            else: "$$value",
                          },
                        },
                      },
                    },
                  ],
                },
                else: "No mutual friends or common interests.",
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        avatar: 1,
        mutualFriends: 1,
        commonInterests: 1,
        reason: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        recommendedPeople,
        "Recommendations retrieved successfully"
      )
    );
});



const addInterests = asyncHandler(async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Interests must be an array"));
  }

  if (interests.length === 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Interests cannot be an empty array"));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { interests: { $each: interests } },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { interests: user.interests },
        "Interests added successfully"
      )
    );
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User ID is required"));
  }

  const user = await User.findById(userId)
    .select("fullname username avatar interests friends")
    .populate("friends", "fullname username avatar");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "User profile retrieved successfully")
    );
});

const unfriendUser = asyncHandler(async (req, res) => {
  const { friendId } = req.body;

  if (!friendId) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Friend ID is required"));
  }

  const user = await User.findById(req.user._id); // Get the logged-in user
  const friend = await User.findById(friendId); // Get the friend user

  if (!user || !friend) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "User or friend not found"));
  }

  // Remove friendId from the user's friends list
  user.friends = user.friends.filter(
    (id) => id.toString() !== friendId.toString()
  );
  await user.save();

  // Remove the user's ID from the friend's friends list
  friend.friends = friend.friends.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await friend.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unfriended successfully"));
});

const searchPeople = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Search query is required"));
  }

  const regex = new RegExp(query, "i"); // Case-insensitive regex for partial matching

  const results = await User.aggregate([
    {
      $match: {
        $or: [{ fullname: { $regex: regex } }, { username: { $regex: regex } }],
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        avatar: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, results, "Search results retrieved successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  handleFriendRequest,
  getAllRequests,
  sendFriendRequest,
  getFriends,
  getRecommendedPeople,
  addInterests,
  getUserProfile,
  getCurrentUser,
  unfriendUser,
  searchPeople,
};
