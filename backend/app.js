import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userApi from "./apis/user-api.js";
import authApi from "./apis/auth-api.js";
import saveApi from "./apis/save-api.js";
import modrinthApi from "./apis/modrinth-api.js";

const MONGODB_URI = "mongodb://127.0.0.1:27017/modshare";
mongoose.connect(MONGODB_URI);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/api/users", userApi);
app.use("/api/auth", authApi);
app.use("/api/saves", saveApi);
app.use("/api/modrinth", modrinthApi);

const port = process.env.PORT || 4000;
app.listen(port);
