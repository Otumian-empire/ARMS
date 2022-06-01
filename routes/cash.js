const cashRouter = require("express").Router();

const {
  find,
  findByTenantId,
  create,
  delete_,
} = require("../controllers/cash.controller");
const joiMiddleware = require("../utils/joi.middleware");
const {
  idRequestParams,
  cashCreateRequestBody,
} = require("../utils/joi.schema");

cashRouter.get("/", find);

// TODO: think about adding an endpoint for reading using the cash's ID
// fetch an cash
cashRouter.get(
  "/:id",
  joiMiddleware(idRequestParams, "params"),
  findByTenantId
);

// create a cash - add cash data
cashRouter.post(
  "/:id",
  [
    joiMiddleware(idRequestParams, "params"),
    joiMiddleware(cashCreateRequestBody),
  ],
  create
);

// delete cash data - cash privileges is needed
cashRouter.delete("/:id", joiMiddleware(idRequestParams, "params"), delete_);

module.exports = { cashRouter };
