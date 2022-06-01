const apartmentRouter = require("express").Router();

const {
  find,
  findById,
  create,
  update,
  delete_,
} = require("../controllers/apartment.controller");
const joiMiddleware = require("../utils/joi.middleware");
const {
  apartmentCreateRequestBody,
  idRequestParams,
  apartmentUpdateRequestBody,
} = require("../utils/joi.schema");

// fetch all apartments
apartmentRouter.get("/", find);

// fetch an apartment
apartmentRouter.get("/:id", joiMiddleware(idRequestParams, "params"), findById);

// create a apartment - add apartment data
apartmentRouter.post("/", joiMiddleware(apartmentCreateRequestBody), create);

// update - apartment may update the room_number, description, fee
apartmentRouter.put(
  "/:id",
  [
    joiMiddleware(idRequestParams, "params"),
    joiMiddleware(apartmentUpdateRequestBody),
  ],
  update
);

// delete an apartment data - admin privileges is needed
apartmentRouter.delete(
  "/:id",
  joiMiddleware(idRequestParams, "params"),
  delete_
);

module.exports = { apartmentRouter };
