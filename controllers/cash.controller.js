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
    const tenantId = req.params.tenantId;

    if (!tenantId) {
      return res.json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    Cash.find({ tenantId })
      .select("-__v")
      .limit(10)
      .then((results) => {
        return res.json(results);
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  create: (req, res) => {
    const tenantId = req.params.tenantId;
    const amount = Number(req.body.amount) || 0;

    if (!tenantId || !amount) {
      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    }

    const token = generateToken();

    Tenant.findById(tenantId)
      .then((result) => {
        if (!result) {
          throw new Error(INVALID_CREDENTIALS);
        }

        Cash.create({ tenantId, token, amount })
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
    const cashId = req.params.cashId;

    Cash.findByIdAndRemove(cashId, (error, deletedCash) => {
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
