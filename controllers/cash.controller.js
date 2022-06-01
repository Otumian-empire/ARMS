const Cash = require("../models/cash").Cash;
const Tenant = require("../models/tenant").Tenant;
const {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  DELETED_SUCCESSFULLY,
} = require("../utils/api.messages");
const { generateToken } = require("../utils/functions");

module.exports = {
  find: (_req, res) => {
    Cash.find()
      .select("-__v")
      .limit(10)
      .exec((error, cashes) => {
        if (error || !cashes)
          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED,
          });

        return res.json(cashes);
      });
  },
  findByTenantId: (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    Cash.find({ tenantId: id })
      .select("-__v")
      .limit(10)
      .then((results) => res.json(results))
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  create: (req, res) => {
    const id = req.params.id;
    const amount = Number(req.body.amount) || 0;

    if (!id || !amount) {
      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    }

    const token = generateToken();

    Tenant.findById(id)
      .then((result) => {
        if (!result) {
          throw new Error(INVALID_CREDENTIALS);
        }

        Cash.create({
          tenantId: id,
          token,
          amount,
        })
          .then((result) => {
            if (!result) {
              throw new Error(AN_ERROR_OCCURRED);
            }

            return res.json({
              success: true,
              message: CASH_ADDED_SUCCESSFULLY,
              id: result.id,
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
    const id = req.params.id;

    Cash.findByIdAndRemove(id, (error, deletedCash) => {
      if (error || !deletedCash) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS,
        });
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: deletedCash.id,
      });
    });
  },
};
