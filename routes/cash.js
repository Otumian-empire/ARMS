const cashRouter = require("express").Router();

const {
  find,
  findOne,
  create,
  login,
  update,
  delete_,
} = require("../controllers/cash.controller");

cashRouter.get("/", find);

// TODO: think about adding an endpoint for reading using the cash's ID
// fetch an cash
cashRouter.get("/:tenantId", findOne);

// create a cash - add cash data
cashRouter.post("/", create);

// login cash - they can change their data
cashRouter.post("/login", login);

// update - cash may update only the email
cashRouter.put("/:cashId", update);

// delete cash data - cash privileges is needed
cashRouter.delete("/:cashId", delete_);

module.exports = { cashRouter };
