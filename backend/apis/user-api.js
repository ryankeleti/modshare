import express from "express";

import {
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../models/user.js";
import {
  findFollowers,
  doesFollow,
  follow,
  unfollow,
} from "../models/follower.js";

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

userApi.get("/:uid", authenticate, async (req, res) => {
  const id = req.params.uid;
  try {
    const user = await findUserById(id);
    res.json(user);
  } catch (e) {
    res.status(404);
    res.json({ error: "No such user" });
  }
});

userApi.get("/:uid/followers", async (req, res) => {
  const id = req.params.uid;
  const followers = await findFollowers(id);
  res.json(followers);
});

userApi.get("/:follower/follow/:followee", async (req, res) => {
  const follower = req.params.follower;
  const followee = req.params.followee;

  res.json(await doesFollow({ follower, followee }));
});

userApi.post("/:follower/follow/:followee", authenticate, async (req, res) => {
  const follower = req.params.follower;
  const followee = req.params.followee;

  if (follower != req.user.id && req.user.role != "admin") {
    res.status(403);
    res.json({ error: "You are not authorized to follow" });
  } else {
    try {
      const relation = await follow({ followee, follower });
      res.json(relation);
    } catch (e) {
      res.status(500);
      res.json({ error: e });
    }
  }
});

userApi.delete(
  "/:follower/follow/:followee",
  authenticate,
  async (req, res) => {
    const follower = req.params.follower;
    const followee = req.params.followee;

    if (follower != req.user.id && req.user.role != "admin") {
      res.status(403);
      res.json({ error: "You are not authorized to unfollow" });
    } else {
      const result = await unfollow({ followee, follower });
      res.json(result);
    }
  }
);

userApi.delete("/:uid", authenticate, async (req, res) => {
  const uid = req.params.uid;
  if (req.user.role === "admin") {
    try {
      await deleteUser(uid);
    } catch (e) {
      res.status(500);
      res.json({ error: e });
    }
  } else {
    res.status(401);
    res.json({ error: "Not authorized" });
  }
});

userApi.put("/:uid", authenticate, async (req, res) => {
  const uid = req.params.uid;
  const update = req.body;
  if (req.user.id === uid || req.user.role === "admin") {
    if (update.hasOwnProperty("role") && req.user.role === "admin") {
      await updateUser(uid, update);
    } else {
      await updateUser(uid, update);
    }
  }
});

export default userApi;
