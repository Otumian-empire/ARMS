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
    Rent.findOne({ _id: req.params.Rent_id })
      .then((rent) => res.json({ rent }))
      .catch((error) => {
        console.log(error);
        return res.json({
          success: false,
          message: error,
        });
      });
  },
  findOneByTenantId: (req, res) => {
    Rent.find()
      .then((rents) => {
        if (rents) {
          rents.filter((rent) => {
            if (rent.tenant === req.params.Tenant_id) return res.json({ rent });
          });
        }
        return res.json({});
      })
      .catch((error) => {
        console.log(error);
        return res.json({
          success: false,
          message: error,
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

            Cash.find({
              id: cashId,
              tenantId,
            })
              .then((cash) => {
                if (!cash) {
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
  update: (req, res) => {
    const { email, phone } = req.body;
    const Rent_id = req.params.Rent_id;

    Rent.findOne({ _id: Rent_id }, (error, Rent) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, msg: error });
      }

      if (!Rent) return res.json({ success: false, msg: "Rent no found" });

      if (email !== undefined) Rent.email = email;
      if (phone !== undefined) Rent.phone = phone;
      if (kins_email !== undefined) Rent.kins_email = kins_email;
      if (kins_phone !== undefined) Rent.kins_phone = kins_phone;

      Rent.save((error, updatedRent) => {
        if (error) {
          console.log(error);
          return res.json({ success: false, msg: error });
        }

        return res.json({
          success: true,
          msg: "Rent details updated",
          id: updatedRent._id,
        });
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
