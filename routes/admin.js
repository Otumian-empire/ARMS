require("dotenv").config();

const adminRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const rounds = parseInt(process.env.SALT_ROUNDS, 12);

adminRouter.get("/", (req, res) => {
  return res.json({ message: "Admin route" });
});

module.exports = adminRouter;
