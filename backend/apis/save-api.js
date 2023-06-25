import express from "express";

import { findAllUsers, findUserById } from "../models/user.js";
import {
  findModSaveById,
  findUserModSaves,
  findSaveForMod,
  findUsersThatSavedMod,
  changeVisibility,
  createModSave,
  deleteModSave,
} from "../models/save.js";

import { authenticate } from "./auth-api.js";

const saveApi = express.Router();

saveApi.get("/:sid", authenticate, async (req, res) => {
  const sid = req.params.sid;
  const modSave = await findModSaveById(sid, req.user);
  if (modSave) {
    res.json(modSave);
  } else {
    res.status(404);
    res.send({ error: "Save not found" });
  }
});

saveApi.put("/:sid", authenticate, async (req, res) => {
  const sid = req.params.sid;
  const is_private = req.query.is_private;
  await changeVisibility(sid, is_private, req.user);
});

saveApi.get("/user/:uid/:pid", authenticate, async (req, res) => {
  const uid = req.params.uid;
  const pid = req.params.pid;
  const modSave = await findSaveForMod(uid, pid, req.user);
  if (modSave) {
    res.json(modSave);
  } else {
    res.status(404);
    res.send({ error: "Save not found" });
  }
});

saveApi.get("/user/:uid", authenticate, async (req, res) => {
  const uid = req.params.uid;
  if (uid) {
    const modSaves = await findUserModSaves(uid, req.user);
    res.json(modSaves);
  }
});

saveApi.post("/", authenticate, async (req, res) => {
  await createModSave(req.body, req.user);
  res.send("");
});

saveApi.delete("/:sid", authenticate, async (req, res) => {
  const sid = req.params.sid;
  await deleteModSave(sid, req.user);
  res.send("");
});

saveApi.get("/:pid/users", authenticate, async (req, res) => {
  const pid = req.params.pid;
  if (pid) {
    const users = await findUsersThatSavedMod(pid, req.user);
    res.json(users);
  }
});

export default saveApi;
