import { Router } from "express";
import Auth from "../config/auth.js";
import { cashController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

route.get("/", cashController.find);

// TODO: think about adding an endpoint for reading using the cash's ID
// fetch an cash
route.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  cashController.findByTenantId
);

// create a cash - add cash data
route.post(
  "/:id",
  [
    Auth.hasBearerToken,
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.cashCreateRequestBody)
  ],
  cashController.create
);

// delete cash data - cash privileges is needed
route.delete(
  "/:id",
  [Auth.hasBearerToken, joiMiddleware(schemas.idRequestParams, "params")],
  cashController.delete_
);

export default route;
