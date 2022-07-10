import { Router } from "express";
import Auth from "../config/auth.js";
import { adminController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schema from "../util/joi.schema.js";

const route = Router();

// fetch an admin
route.get(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    joiMiddleware(schema.idRequestParams, "params")
  ],
  adminController.findById
);

// create a admin - add admin data
route.post(
  "/",
  joiMiddleware(schema.adminSignupRequestBody),
  adminController.create
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
    joiMiddleware(schema.idRequestParams, "params"),
    joiMiddleware(schema.adminUpdateRequestBody)
  ],
  adminController.update
);

// delete admin data - admin privileges is needed
route.delete(
  "/:id",
  [Auth.hasBearerToken, joiMiddleware(schema.idRequestParams, "params")],
  adminController.delete_
);

export default route;
