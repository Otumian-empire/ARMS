const { Apartment } = require("../models/apartment");
const {
  NOT_FOUND,
  AN_ERROR_OCCURRED,
  APARTMENT_CREATED_SUCCESSFULLY,
  UPDATE_SUCCESSFUL,
  DELETED_SUCCESSFULLY,
} = require("../utils/api.messages");

module.exports = {
  find: (_req, res) => {
    Apartment.find()
      .select("-__v")
      .then((apartments) => res.json(apartments))
      .catch((_error) => {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      });
  },
  findById: (req, res) => {
    const apartmentId = req.params.apartmentId;

    Apartment.findById(apartmentId)
      .select("-__v")
      .then((apartment) => {
        if (!apartment) {
          throw new Error(NOT_FOUND);
        }

        return res.json(apartment);
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  // TODO: Admin privilege is required
  create: (req, res) => {
    let { roomNumber, description, price } = req.body;

    const apartment = new Apartment({
      roomNumber,
      description,
      price: Number(price),
    });

    apartment.save((error, result) => {
      if (error || !result) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      }

      return res.json({
        success: true,
        message: APARTMENT_CREATED_SUCCESSFULLY,
        id: result.id,
      });
    });
  },
  update: (req, res) => {
    const apartmentId = req.params.apartmentId;
    const { roomNumber, description, price } = req.body;

    Apartment.findById(apartmentId)
      .then((apartment) => {
        if (!apartment) {
          throw new Error(NOT_FOUND);
        }

        if (roomNumber) {
          apartment.roomNumber = roomNumber;
        }

        if (description) {
          apartment.description = description;
        }

        if (price) {
          apartment.price = Number(price);
        }

        apartment.save((error, updatedApartment) => {
          if (error || !updatedApartment) {
            return res.json({
              success: false,
              message: AN_ERROR_OCCURRED,
            });
          }

          return res.json({
            success: true,
            message: UPDATE_SUCCESSFUL,
            id: updatedApartment.id,
          });
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  delete_: (req, res) => {
    const apartmentId = req.params.apartmentId;

    Apartment.findByIdAndDelete(apartmentId, (error, deletedApartment) => {
      if (error || !deletedApartment) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: deletedApartment.id,
      });
    });
  },
};
