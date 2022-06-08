import { Router } from "express";

import {
  create,
  delete_,
  find,
  findById,
  update,
} from "../controller/apartment.controller.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all apartments
route.get("/", find);

// fetch an apartment
route.get("/:id", joiMiddleware(schemas.idRequestParams, "params"), findById);

// create a apartment - add apartment data
route.post("/", joiMiddleware(schemas.apartmentCreateRequestBody), create);

// update - apartment may update the room_number, description, fee
route.put(
  "/:id",
  [
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.apartmentUpdateRequestBody),
  ],
  update
);

// delete an apartment data - admin privileges is needed
route.delete("/:id", joiMiddleware(schemas.idRequestParams, "params"), delete_);

export default route;
