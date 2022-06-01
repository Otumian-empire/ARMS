const {
  AN_ERROR_OCCURRED,
  RENT_ADDED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  NOT_FOUND,
  DELETED_SUCCESSFULLY,
  APARTMENT_IS_OCCUPIED,
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
        logger.error(error);

        if (error) {
          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED,
          });
        }

        return res.json(rents);
      });
  },
  findOneByRentId: (req, res) => {
    const id = req.params.id;

    Rent.findById(id)
      .select("-__v")
      .then((rent) => {
        if (!rent) {
          throw new Error(NOT_FOUND);
        }

        return res.json(rent);
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  create: (req, res) => {
    const id = req.params.id;
    const { apartmentId, cashId } = req.body;

    if (!id || !apartmentId || !cashId) {
      return res.json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    Apartment.findById(apartmentId)
      .then((apartment) => {
        if (!apartment) {
          throw new Error(INVALID_CREDENTIALS);
        }

        Tenant.findById(id)
          .then((tenant) => {
            if (!tenant) {
              throw new Error(INVALID_CREDENTIALS);
            }

            Cash.find({ _id: cashId, tenantId: id })
              .then((cash) => {
                if (!cash) {
                  throw new Error(NOT_FOUND);
                }

                Rent.findOne({ apartmentId })
                  .then((isOccupied) => {
                    if (isOccupied) {
                      throw new Error(APARTMENT_IS_OCCUPIED);
                    }

                    // TODO: add a field to the cash table that indicates the
                    // status of cash. we can not rent with an apartment with
                    // a used cash ID

                    Rent.create({
                      tenantId: id,
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
                        logger.error(error);

                        return res.json({
                          success: false,
                          message: error.message,
                        });
                      });
                  })
                  .catch((error) => {
                    logger.error(error);

                    return res.json({
                      success: false,
                      message: error.message,
                    });
                  });
              })
              .catch((error) => {
                logger.error(error);

                return res.json({
                  success: false,
                  message: error.message,
                });
              });
          })
          .catch((error) => {
            logger.error(error);

            return res.json({
              success: false,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  delete_: (req, res) => {
    const id = req.params.id;

    Rent.findByIdAndDelete(id)
      .then((result) => {
        if (!result) {
          throw new Error(NOT_FOUND);
        }

        return res.json({
          success: true,
          message: DELETED_SUCCESSFULLY,
          id: result.id,
        });
      })
      .catch((error) => {
        logger.error(error);

        if (error) {
          return res.json({
            success: false,
            message: error.message,
          });
        }
      });
  },
};
