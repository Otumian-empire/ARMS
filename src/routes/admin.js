import { Router } from "express";

import {
  create,
  delete_,
  findById,
  login,
  update,
} from "../controllers/admin.controller.js";
import joiMiddleware from "../utils/joi.middleware.js";
import schema from "../utils/joi.schema.js";

const adminRouter = Router();

// fetch an admin
adminRouter.get(
  "/:id",
  joiMiddleware(schema.idRequestParams, "params"),
  findById
);

// create a admin - add admin data
adminRouter.post("/", joiMiddleware(schema.adminSignupRequestBody), create);

// login admin - they can change their data
adminRouter.post("/login", joiMiddleware(schema.loginRequestBody), login);

// update - admin may update only the email
adminRouter.put(
  "/:id",
  [
    joiMiddleware(schema.idRequestParams, "params"),
    joiMiddleware(schema.adminUpdateRequestBody),
  ],
  update
);

// delete admin data - admin privileges is needed
adminRouter.delete(
  "/:id",
  joiMiddleware(schema.idRequestParams, "params"),
  delete_
);

export { adminRouter };
