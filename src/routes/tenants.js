import { Router } from "express";

import {
  create,
  delete_,
  find,
  findById,
  login,
  update,
} from "../controllers/tenant.controller.js";

import joiMiddleware from "../utils/joi.middleware.js";
import schemas from "../utils/joi.schema.js";

const tenantRouter = Router();

// fetch all tenants
tenantRouter.get("/", find);

// fetch a tenant
tenantRouter.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  findById
);

// create a tenant - add tenant data
tenantRouter.post("/", joiMiddleware(schemas.tenantCreateRequestBody), create);

// login tenant - they can change their data
tenantRouter.post("/login", joiMiddleware(schemas.loginRequestBody), login);

// update - tenant may update only their email and phone number
// this applies for the next of kins
tenantRouter.put(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.tenantUpdateRequestBody),
  ],
  update
);

// delete tenant data - admin privileges is needed
tenantRouter.delete(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  delete_
);

export { tenantRouter };
