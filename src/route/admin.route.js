import { Router } from "express";
import {
  AdminAuthentication,
  JWTAuthentication as Auth
} from "../authentication/index.js";
import { adminController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schema from "../util/joi.schema.js";

const route = Router();

// create a admin - add admin data
route.post(
  "/",
  joiMiddleware(schema.adminSignupRequestBody),
  adminController.create
);

// fetch an admin
route.get(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schema.idRequestParams, "params")
  ],
  adminController.findById
);

// login admin
route.post(
  "/login",
  joiMiddleware(schema.loginRequestBody),
  adminController.login
);

// update - admin may update only the email
route.put(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schema.idRequestParams, "params"),
    joiMiddleware(schema.adminUpdateRequestBody)
  ],
  adminController.update
);

// delete admin data - admin privileges is needed
route.delete(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schema.idRequestParams, "params")
  ],
  adminController.delete_
);

export default route;
