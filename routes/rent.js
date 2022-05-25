const rentRouter = require("express").Router();

const {
  find,
  findOneByRentId,
  findOneByTenantId,
  create,
  update,
  delete_,
} = require("../controllers/rent.controller");

// fetch all Rents
rentRouter.get("/", find);

// fetch a Rent by Rent id
rentRouter.get("/:rentId", findOneByRentId);

// fetch a Rent by Tenant id
rentRouter.get("/:tenantId", findOneByTenantId);

// create a Rent - add Rent data
rentRouter.post("/:tenantId", create);

rentRouter.put("/:rentId", update);

// delete Rent data - admin privileges is needed
rentRouter.delete("/:rentId", delete_);

module.exports = { rentRouter };
