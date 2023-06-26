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

export const findFollowing = async (user) =>
  await followerModel
    .find({ follower: user }, "followee")
    .populate("followee")
    .exec();

export const doesFollow = ({ followee, follower }) =>
  followerModel.exists({ followee, follower });

export const follow = async ({ followee, follower }) => {
  const exists = await doesFollow({ followee, follower });
  if (!exists) {
    return await followerModel.create({ followee, follower });
  } else {
    return null;
  }
};

export const unfollow = ({ followee, follower }) =>
  followerModel.findOneAndDelete({ followee, follower });
