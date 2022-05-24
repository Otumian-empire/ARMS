const cashRouter = require("express").Router();

const {
  find,
  findByTenantId,
  create,
  delete_,
} = require("../controllers/cash.controller");

cashRouter.get("/", find);

// TODO: think about adding an endpoint for reading using the cash's ID
// fetch an cash
cashRouter.get("/:tenantId", findByTenantId);

// create a cash - add cash data
cashRouter.post("/:tenantId", create);

// delete cash data - cash privileges is needed
cashRouter.delete("/:cashId", delete_);

module.exports = { cashRouter };
