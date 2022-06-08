import { Router } from "express";

import {
  create,
  delete_,
  find,
  findOneByRentId,
} from "../controller/rent.controller.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all Rents
route.get("/", find);

// fetch a Rent by Rent id
route.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  findOneByRentId
);

// create a Rent - add Rent data
route.post(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.rentCreateRequestBody),
  ],
  create
);

// delete Rent data - admin privileges is needed
route.delete("/:id", joiMiddleware(schemas.idRequestParams, "params"), delete_);

export default route;
