const rentRouter = require("express").Router();

const {
  find,
  findOneByRentId,
  create,
  delete_,
} = require("../controllers/rent.controller");
const joiMiddleware = require("../utils/joi.middleware");
const {
  idRequestParams,
  rentCreateRequestBody,
} = require("../utils/joi.schema");

// fetch all Rents
rentRouter.get("/", find);

// fetch a Rent by Rent id
rentRouter.get(
  "/:id",
  joiMiddleware(idRequestParams, "params"),
  findOneByRentId
);

// create a Rent - add Rent data
rentRouter.post(
  "/:id",
  [
    joiMiddleware(idRequestParams, "params"),
    joiMiddleware(rentCreateRequestBody),
  ],
  create
);

// delete Rent data - admin privileges is needed
rentRouter.delete("/:id", joiMiddleware(idRequestParams, "params"), delete_);

module.exports = { rentRouter };
