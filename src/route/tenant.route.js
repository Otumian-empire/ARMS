import { Router } from "express";

import {
  create,
  delete_,
  find,
  findById,
  login,
  update,
} from "../controller/tenant.controller.js";

import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all tenants
route.get("/", find);

// fetch a tenant
route.get("/:id", joiMiddleware(schemas.idRequestParams, "params"), findById);

// create a tenant - add tenant data
route.post("/", joiMiddleware(schemas.tenantCreateRequestBody), create);

// login tenant - they can change their data
route.post("/login", joiMiddleware(schemas.loginRequestBody), login);

// update - tenant may update only their email and phone number
// this applies for the next of kins
route.put(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.tenantUpdateRequestBody),
  ],
  update
);

// delete tenant data - admin privileges is needed
route.delete("/:id", joiMiddleware(schemas.idRequestParams, "params"), delete_);

export default route;
