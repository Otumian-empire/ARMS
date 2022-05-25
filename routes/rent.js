const rentRouter = require("express").Router();

const {
  find,
  findOneByRentId,
  create,
  delete_,
} = require("../controllers/rent.controller");

// fetch all Rents
rentRouter.get("/", find);

// fetch a Rent by Rent id
rentRouter.get("/:rentId", findOneByRentId);

// create a Rent - add Rent data
rentRouter.post("/:tenantId", create);

// delete Rent data - admin privileges is needed
rentRouter.delete("/:rentId", delete_);

module.exports = { rentRouter };
