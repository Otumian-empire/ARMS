require("dotenv").config();

const apartmentRouter = require("express").Router();
const { Apartment } = require("../models/apartment");

// fetch all apartments
apartmentRouter.get("/", (req, res) => {
  Apartment.collection
    .find()
    .toArray()
    .then((apartments) => res.json({ apartments }))
    .catch((err) => {
      console.log(err);
      return res.json({
        success: false,
        message: err,
      });
    });
});

// fetch an apartment
apartmentRouter.get("/:apartment_id", (req, res) => {
  Apartment.findOne({ _id: req.params.apartment_id }, (err, apartment) => {
    if (err) {
      console.log(err);
      return res.json({
        success: false,
        message: err,
      });
    }

    if (!apartment)
      return res.json({ success: false, msg: "apartment not found" });

    return res.json({ apartment });
  });
});

// create a apartment - add apartment data
apartmentRouter.post("/create", (req, res) => {
  let { room_number, description, fee } = req.body;

  Apartment.create(
    { room_number, description, fee },
    (err, createdApartment) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      }

      if (!createdApartment)
        return res.json({ success: false, msg: "apartment not created" });

      return res.json({
        success: true,
        message: "apartment created successfully",
        id: createdApartment._id,
      });
    }
  );
});

// update - apartment may update the room_number, description, fee
apartmentRouter.put("/update/:apartment_id", (req, res) => {
  const { room_number, description, fee } = req.body;
  const apartment_id = req.params.apartment_id;

  Apartment.findOne({ _id: apartment_id }, (err, apartment) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, msg: err });
    }

    if (!apartment)
      return res.json({ success: false, msg: "apartment no found" });

    apartment.room_number = room_number;
    apartment.description = description;
    apartment.fee = fee;

    apartment.save((err, updatedApartment) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      return res.json({
        success: true,
        msg: "apartment details updated",
        id: updatedApartment._id,
      });
    });
  });
});

// delete an apartment data - admin privileges is needed
apartmentRouter.delete("/delete/:apartment_id", (req, res) => {
  const apartment_id = req.params.apartment_id;

  Apartment.findOneAndRemove(
    { _id: apartment_id },
    (err, deletedApartment) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!deletedApartment)
        return res.json({ success: false, msg: "apartment no found" });

      return res.json({
        success: true,
        msg: "apartment details deleted successfully",
        id: deletedApartment._id,
      });
    }
  );
});

module.exports = apartmentRouter;