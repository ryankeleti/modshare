import express from "express";

import jwt from "jsonwebtoken";

import { createUser, findByCredentials } from "../models/user.js";

const JWT_SECRET = "verysecret"; // Decidedly not secret.

const authApi = express.Router();

authApi.post("/register", async (req, res) => {
  try {
    const user = await createUser(req.body);
    const token = createToken(user);
    res.json({ token });
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ error: "Could not register" });
  }
});

authApi.post("/login", async (req, res) => {
  const user = await findByCredentials(req.body);
  if (user) {
    const token = createToken(user);
    res.json({ token });
  } else {
    res.status(401);
    res.json({ error: "Invalid login" });
  }
});

const createToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "10000s",
    }
  );

export const authenticate = (req, res, next) => {
  const auth = req.get("Authorization");
  console.log(auth);
  if (auth) {
    const token = auth.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      res.status(403);
      res.json({ error: "Invalid token" });
    }
  } else {
    res.status(401);
    res.json({ error: "Missing authorization" });
  }
};

export default authApi;
