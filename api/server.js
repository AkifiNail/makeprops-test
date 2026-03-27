// const express = require("express");
import express from "express";
const app = express();
const port = 3000;
import { initDb } from "./db.js";
import cors from "cors";

import UserRouter from "./routes/user.js";

// const { initDb } = require("./db");

await initDb();

app.use(cors());
app.use(express.json());

app.use("/user", UserRouter);

app.listen(port, () => {
  console.log("serveur lancé");
});
