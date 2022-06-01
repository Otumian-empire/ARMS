const adminRouter = require("express").Router();

const {
  findById,
  create,
  login,
  update,
  delete_,
} = require("../controllers/admin.controller");
const joiMiddleware = require("../utils/joi.middleware");
const {
  adminSignupRequestBody,
  adminUpdateRequestBody,
  loginRequestBody,
  idRequestParams,
} = require("../utils/joi.schema");

// fetch an admin
adminRouter.get("/:id", joiMiddleware(idRequestParams, "params"), findById);

// create a admin - add admin data
adminRouter.post("/", joiMiddleware(adminSignupRequestBody), create);

// login admin - they can change their data
adminRouter.post("/login", joiMiddleware(loginRequestBody), login);

// update - admin may update only the email
adminRouter.put(
  "/:id",
  [
    joiMiddleware(idRequestParams, "params"),
    joiMiddleware(adminUpdateRequestBody),
  ],
  update
);

// delete admin data - admin privileges is needed
adminRouter.delete("/:id", joiMiddleware(idRequestParams, "params"), delete_);

module.exports = { adminRouter };
