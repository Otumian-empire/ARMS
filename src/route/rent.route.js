import { Router } from "express";
import Auth from "../config/auth.js";
import { rentController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all Rents
route.get("/", rentController.find);

// fetch a Rent by Rent id
route.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  rentController.findOneByRentId
);

// create a Rent - add Rent data
route.post(
  "/:id",
  [
    Auth.hasBearerToken,
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.rentCreateRequestBody)
  ],
  rentController.create
);

// delete Rent data - admin privileges is needed
route.delete(
  "/:id",
  [Auth.hasBearerToken, joiMiddleware(schemas.idRequestParams, "params")],
  rentController.delete_
);

export default route;
