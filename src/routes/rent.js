import { Router } from "express";

import {
  create,
  delete_,
  find,
  findOneByRentId,
} from "../controllers/rent.controller.js";
import joiMiddleware from "../utils/joi.middleware.js";
import schemas from "../utils/joi.schema.js";

const rentRouter = Router();

// fetch all Rents
rentRouter.get("/", find);

// fetch a Rent by Rent id
rentRouter.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  findOneByRentId
);

// create a Rent - add Rent data
rentRouter.post(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.rentCreateRequestBody),
  ],
  create
);

// delete Rent data - admin privileges is needed
rentRouter.delete(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  delete_
);

export { rentRouter };
