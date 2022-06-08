import { Router } from "express";

import {
  create,
  delete_,
  findById,
  login,
  update,
} from "../controller/admin.controller.js";
import joiMiddleware from "../util/joi.middleware.js";
import schema from "../util/joi.schema.js";

const route = Router();

// fetch an admin
route.get(
  "/:id",
  joiMiddleware(schema.idRequestParams, "params"),
  findById
);

// create a admin - add admin data
route.post("/", joiMiddleware(schema.adminSignupRequestBody), create);

// login admin - they can change their data
route.post("/login", joiMiddleware(schema.loginRequestBody), login);

// update - admin may update only the email
route.put(
  "/:id",
  [
    joiMiddleware(schema.idRequestParams, "params"),
    joiMiddleware(schema.adminUpdateRequestBody),
  ],
  update
);

// delete admin data - admin privileges is needed
route.delete(
  "/:id",
  joiMiddleware(schema.idRequestParams, "params"),
  delete_
);

export default route;
