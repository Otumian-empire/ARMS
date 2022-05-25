const {
  AN_ERROR_OCCURRED,
  RENT_ADDED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  NOT_FOUND,
} = require("../utils/api.messages");

const Rent = require("../models/rent").Rent;
const Tenant = require("../models/tenant").Tenant;
const Apartment = require("../models/apartment").Apartment;
const Cash = require("../models/cash").Cash;

module.exports = {
  find: (_req, res) => {
    Rent.find()
      .limit(10)
      .select("-__v")
      .exec((error, rents) => {
        if (error || !rents) {
          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED,
          });
        }

        return res.json(rents);
      });
  },
  findOneByRentId: (req, res) => {
    const rentId = req.params.rentId;

    Rent.findById(rentId)
      .select("-__v")
      .then((rent) => res.json(rent))
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  create: (req, res) => {
    const tenantId = req.params.tenantId;
    // console.log(tenantId);
    const { apartmentId, cashId } = req.body;
    // console.log({ apartmentId, cashId });

    if (!tenantId || !apartmentId || !cashId) {
      return res.json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    Tenant.findById(tenantId)
      .then((tenant) => {
        if (!tenant) {
          throw new Error(INVALID_CREDENTIALS);
        }

        Apartment.findById(apartmentId)
          .then((apartment) => {
            if (!apartment) {
              throw new Error(INVALID_CREDENTIALS);
            }

            Cash.find()
              .then((cashes) => {
                if (!cashes) {
                  throw new Error(NOT_FOUND);
                }

                const tenantCashes = cashes.filter((cash) => {
                  return cash.id === cashId && cash.tenantId == tenantId;
                });

                if (tenantCashes.length !== 1) {
                  throw new Error(NOT_FOUND);
                }

                Rent.create({
                  tenantId,
                  apartmentId,
                  cashId,
                })
                  .then((rent) => {
                    if (rent)
                      return res.json({
                        success: true,
                        message: RENT_ADDED_SUCCESSFULLY,
                        id: rent.id,
                      });
                  })
                  .catch((error) => {
                    return res.json({
                      success: false,
                      message: error.message,
                    });
                  });
              })
              .catch((error) => {
                return res.json({
                  success: false,
                  message: error.message,
                });
              });
          })
          .catch((error) => {
            return res.json({
              success: false,
              message: error.message,
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
    const Rent_id = req.params.rentId;

    Rent.findOneAndRemove({ _id: Rent_id }, (error, deletedRent) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, msg: error });
      }

      if (!deletedRent)
        return res.json({ success: false, msg: "Rent no found" });

      return res.json({
        success: true,
        msg: "Rent details deleted successfully",
        id: deletedRent._id,
      });
    });
  },
};
