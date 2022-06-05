import { Router } from "express";

import {
  find,
  findByTenantId,
  create,
  delete_,
} from "../controllers/cash.controller.js";
import joiMiddleware from "../utils/joi.middleware.js";
import schemas from "../utils/joi.schema.js";

const cashRouter = Router();

cashRouter.get("/", find);

// TODO: think about adding an endpoint for reading using the cash's ID
// fetch an cash
cashRouter.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  findByTenantId
);

// create a cash - add cash data
cashRouter.post(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.cashCreateRequestBody),
  ],
  create
);

// delete cash data - cash privileges is needed
cashRouter.delete(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  delete_
);

export { cashRouter };
