import logger from "../config/logger.js";
import { cashModel, tenantModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
} from "../util/api.message.js";
import { generateToken } from "../util/function.js";

export default class CashController {
  static find(_req, res) {
    cashModel
      .find()
      .select("-__v")
      .limit(10)
      .then((cashes) => res.json(cashes))
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      });
  }

  static findByTenantId(req, res) {
    const id = req.params.id;

    if (!id) {
      return res.json({
        success: false,
        message: INVALID_CREDENTIALS,
      });
    }

    cashModel
      .find({ tenantId: id })
      .select("-__v")
      .limit(10)
      .then((results) => res.json(results))
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  }

  static create(req, res) {
    const id = req.params.id;
    const amount = Number(req.body.amount) || 0;

    if (!id || !amount) {
      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    }

    const token = generateToken();

    tenantModel
      .findById(id)
      .then((result) => {
        if (!result) {
          throw new Error(INVALID_CREDENTIALS);
        }

        cashModel
          .create({
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
  }

  static delete_(req, res) {
    const id = req.params.id;

    cashModel.findByIdAndRemove(id, (error, deletedCash) => {
      if (error) {
        logger.error(error);

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
  }
}
