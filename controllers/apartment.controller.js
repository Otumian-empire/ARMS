const { Apartment } = require("../models/apartment");

module.exports = {
  find: (req, res) => {
    Apartment.find()
      .then((apartments) => res.json({ apartments }))
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  findOne: (req, res) => {
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
  },
  create: (req, res) => {
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
  },
  update: (req, res) => {
    const { room_number, description, fee } = req.body;
    const apartmentId = req.params.apartmentId;

    Apartment.findOne({ _id: apartmentId }, (err, apartment) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!apartment)
        return res.json({ success: false, msg: "apartment no found" });

      if (room_number != undefined) apartment.room_number = room_number;

      if (description !== undefined) apartment.description = description;

      if (fee !== undefined) apartment.fee = fee;

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
  },
  delete_: (req, res) => {
    const apartmentId = req.params.apartmentId;

    Apartment.findOneAndRemove(
      { _id: apartmentId },
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
  },
};
