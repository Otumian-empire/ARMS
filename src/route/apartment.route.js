import { Router } from "express";
import Auth from "../config/auth.js";
import { apartmentController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all apartments
route.get("/", apartmentController.find);

// fetch an apartment
route.get(
  "/:id",
  joiMiddleware(schemas.idRequestParams, "params"),
  apartmentController.findById
);

// create a apartment - add apartment data
route.post(
  "/",
  [Auth.hasBearerToken, joiMiddleware(schemas.apartmentCreateRequestBody)],
  apartmentController.create
);

// update - apartment may update the room_number, description, fee
route.put(
  "/:id",
  [
    Auth.hasBearerToken,
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.apartmentUpdateRequestBody)
  ],
  apartmentController.update
);

// delete an apartment data - admin privileges is needed
route.delete(
  "/:id",
  [Auth.hasBearerToken, joiMiddleware(schemas.idRequestParams, "params")],
  apartmentController.delete_
);

export default route;
