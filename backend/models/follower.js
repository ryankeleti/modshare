import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    followee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "followers" }
);

const followerModel = mongoose.model("Follower", followerSchema);

export const findFollowers = async (user) =>
  await followerModel
    .find({ followee: user }, "follower")
    .populate("follower")
    .exec();

export const follow = ({ followee, follower }) =>
  followerModel.create({ followee, follower });

export const unfollow = ({ followee, follower }) =>
  followerModel.findOneAndDelete({ followee, follower });
