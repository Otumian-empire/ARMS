import { Router } from "express";
import {
  AdminAuthentication,
  JWTAuthentication as Auth
} from "../authentication/index.js";
import { ApartmentCaching } from "../caching/index.js";
import { apartmentController } from "../controller/index.js";
import joiMiddleware from "../util/joi.middleware.js";
import schemas from "../util/joi.schema.js";

const route = Router();

// fetch all apartments
route.get(
  "/",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    ApartmentCaching.find
  ],
  apartmentController.find
);

// fetch an apartment
route.get(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schemas.idRequestParams, "params"),
    ApartmentCaching.findById
  ],
  apartmentController.findById
);

// create a apartment - add apartment data
route.post(
  "/",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schemas.apartmentCreateRequestBody)
  ],
  apartmentController.create
);

// update - apartment may update the room_number, description, fee
route.put(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schemas.idRequestParams, "params"),
    joiMiddleware(schemas.apartmentUpdateRequestBody)
  ],
  apartmentController.update
);

// delete an apartment data - admin privileges is needed
route.delete(
  "/:id",
  [
    Auth.hasBearerToken,
    Auth.hasExpiredToken,
    AdminAuthentication,
    joiMiddleware(schemas.idRequestParams, "params")
  ],
  apartmentController.delete_
);

export default route;
