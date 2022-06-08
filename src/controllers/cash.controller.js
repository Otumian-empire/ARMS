import logger from "../config/logger.js";
import { Cash, Tenant } from "../models/index.js";
import {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
} from "../utils/api.messages.js";
import { generateToken } from "../utils/functions.js";

export function find(_req, res) {
  Cash.find()
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

export function findByTenantId(req, res) {
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
      logger.error(error);

      return res.json({
        success: false,
        message: error.message,
      });
    });
}

export function create(req, res) {
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

export function delete_(req, res) {
  const id = req.params.id;

  Cash.findByIdAndRemove(id, (error, deletedCash) => {
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
