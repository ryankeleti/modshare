import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
  },
  { collection: "users" }
);

const userModel = mongoose.model("User", userSchema);

export const findAllUsers = () => userModel.find();

export const findUserById = (id) => userModel.findById(id);

export const findByUsername = (username) => userModel.findOne({ username });

export const findByCredentials = ({ username, password }) =>
  userModel.findOne({ username, password });

export const createUser = (user) => userModel.create(user);

export const updateUser = (id, user) =>
  userModel.updateOne({ _id: id }, { $set: user });

export const deleteUser = (id) => userModel.deleteOne({ _id: id });
