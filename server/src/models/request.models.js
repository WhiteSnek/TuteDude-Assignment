import mongoose, { Schema } from "mongoose";

const requestSchema = new Schema(
  {
    fromUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    toUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Request = mongoose.model("Request", requestSchema);