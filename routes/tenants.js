const tenantRouter = require("express").Router();
const {
  find,
  findById,
  create,
  login,
  update,
  delete_,
} = require("../controllers/tenant.controller");

const joiMiddleware = require("../utils/joi.middleware");
const {
  loginRequestBody,
  tenantUpdateRequestBody,
} = require("../utils/joi.schema");
const {
  idRequestParams,
  tenantCreateRequestBody,
} = require("../utils/joi.schema");

// fetch all tenants
tenantRouter.get("/", find);

// fetch a tenant
tenantRouter.get("/:id", joiMiddleware(idRequestParams, "params"), findById);

// create a tenant - add tenant data
tenantRouter.post("/", joiMiddleware(tenantCreateRequestBody), create);

// login tenant - they can change their data
tenantRouter.post("/login", joiMiddleware(loginRequestBody), login);

// update - tenant may update only their email and phone number
// this applies for the next of kins
tenantRouter.put(
  "/:id",
  [
    joiMiddleware(idRequestParams, "params"),
    joiMiddleware(tenantUpdateRequestBody),
  ],
  update
);

// delete tenant data - admin privileges is needed
tenantRouter.delete("/:id", joiMiddleware(idRequestParams, "params"), delete_);

module.exports = { tenantRouter };
