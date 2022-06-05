import { Router } from "express";

import {
  create,
  delete_,
  find,
  findById,
  update,
} from "../controllers/apartment.controller.js";
import joiMiddleware from "../utils/joi.middleware.js";
import schemas from "../utils/joi.schema.js";

const apartmentRouter = Router();

// fetch all apartments
apartmentRouter.get("/", find);

// fetch an apartment
apartmentRouter.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  findById
);

// create a apartment - add apartment data
apartmentRouter.post(
  "/",
  joiMiddleware(schemas.apartmentCreateRequestBody),
  create
);

// update - apartment may update the room_number, description, fee
apartmentRouter.put(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.apartmentUpdateRequestBody),
  ],
  update
);

// delete an apartment data - admin privileges is needed
apartmentRouter.delete(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  delete_
);

export { apartmentRouter };
