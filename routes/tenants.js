const tenantRouter = require("express").Router();
const {
  find,
  findById,
  create,
  login,
  update,
  delete_,
} = require("../controllers/tenant.controller");

// fetch all tenants
tenantRouter.get("/", find);

// fetch a tenant
tenantRouter.get("/:tenantId", findById);

// create a tenant - add tenant data
tenantRouter.post("/", create);

// login tenant - they can change their data
tenantRouter.post("/login", login);

// update - tenant may update only their email and phone number
// this applies for the next of kins
tenantRouter.put("/:tenantId", update);

// delete tenant data - admin privileges is needed
tenantRouter.delete("/:tenantId", delete_);

module.exports = { tenantRouter };
