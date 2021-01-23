require("dotenv").config();

const tenantRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const rounds = parseInt(process.env.SALT_ROUNDS, 12);

tenantRouter.get("/", (req, res) => {
  return res.json({ message: "Tenant route" });
});

module.exports = tenantRouter;
