const apartmentRouter = require("express").Router();

const {
  find,
  findById,
  create,
  update,
  delete_,
} = require("../controllers/apartment.controller");

// fetch all apartments
apartmentRouter.get("/", find);

// fetch an apartment
apartmentRouter.get("/:apartmentId", findById);

// create a apartment - add apartment data
apartmentRouter.post("/", create);

// update - apartment may update the room_number, description, fee
apartmentRouter.put("/:apartmentId", update);

// delete an apartment data - admin privileges is needed
apartmentRouter.delete("/:apartmentId", delete_);

module.exports = { apartmentRouter };
