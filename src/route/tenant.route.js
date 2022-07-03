import { Router } from "express";
import Auth from "../config/auth.js";
import { tenantController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all tenants
route.get("/", tenantController.find);

// fetch a tenant
route.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  tenantController.findById
);

// create a tenant - add tenant data
route.post(
  "/",
  joiMiddleware(schemas.tenantCreateRequestBody),
  tenantController.create
);

// login tenant - they can change their data
route.post(
  "/login",
  joiMiddleware(schemas.loginRequestBody),
  tenantController.login
);

// update - tenant may update only their email and phone number
// this applies for the next of kins
route.put(
  "/:id",
  [
    Auth.hasBearerToken,
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.tenantUpdateRequestBody)
  ],
  tenantController.update
);

// delete tenant data - admin privileges is needed
route.delete(
  "/:id",
  [Auth.hasBearerToken, joiMiddleware(schemas.idRequestParams, "params")],
  tenantController.delete_
);

export default route;
