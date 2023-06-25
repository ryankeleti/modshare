import express from "express";

import { findAllUsers, findUserById } from "../models/user.js";
import { findFollowers, follow, unfollow } from "../models/follower.js";

import { authenticate } from "./auth-api.js";

const userApi = express.Router();

userApi.get("/", async (req, res) => {
  const users = await findAllUsers();
  res.json(users);
});

userApi.get("/self", authenticate, async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json({ email: user.email, username: req.user.username, id: req.user.id });
});

userApi.get("/:uid", async (req, res) => {
  const id = req.params.uid;
  try {
    const user = await findUserById(id);
    res.json(user);
  } catch {
    res.status(404);
    res.json({ error: "No such user" });
  }
});

userApi.get("/:uid/followers", async (req, res) => {
  const id = req.params.uid;
  const followers = await findFollowers(id);
  res.json(followers);
});

userApi.post("/:follower/follow/:followee", authenticate, async (req, res) => {
  const follower = req.params.follower;
  const followee = req.params.followee;

  if (follower != req.user.id || req.user.role != "admin") {
    res.status(403);
    res.send("You are not authorized to follow");
  } else {
    try {
      const relation = await follow({ followee, follower });
      res.json(relation);
    } catch (e) {
      res.status(500);
      res.send(e);
    }
  }
});

userApi.delete(
  "/:follower/follow/:followee",
  authenticate,
  async (req, res) => {
    const follower = req.params.follower;
    const followee = req.params.followee;

    if (follower != req.user.id || req.user.role != "admin") {
      res.status(403);
      res.send("You are not authorized to unfollow");
    } else {
      const result = await unfollow({ followee, follower });
      res.json(result);
    }
  }
);

export default userApi;
