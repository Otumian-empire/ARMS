import logger from "../config/logger.js";
import { cashModel, tenantModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS
} from "../util/api.message.js";
import { PAGINATION } from "../util/app.constant.js";
import { generateToken, pagination } from "../util/function.js";

export default class CashController {
  static async find(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const { limit, skip } = pagination(page, pageSize);

      const cashes = await cashModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-__v");

      const redisKey = `CASH:${page}:${pageSize}`;
      Cache.setEx(redisKey, 3600, JSON.stringify(cashes));

      return res.json(cashes);
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  }

  static async findByTenantId(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const { limit, skip } = pagination(page, pageSize);
      const id = req.params.id;

      const cashes = await cashModel
        .find({ tenantId: id })
        .skip(skip)
        .limit(limit)
        .select("-__v");

      const redisKey = `CASH:${id}:${page}:${pageSize}`;
      Cache.setEx(redisKey, 3600, JSON.stringify(cashes));

      return res.json(cashes);
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: error.message
      });
    }
  }

  static async create(req, res) {
    try {
      const id = req.params.id;
      const amount = Number(req.body.amount) || 0;

      if (!id || !amount) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED
        });
      }

      const tenant = await tenantModel.findById(id);

      if (!tenant) {
        throw new Error(INVALID_CREDENTIALS);
      }

      const token = generateToken();

      const cash = await cashModel.create({
        tenantId: tenant.id,
        token,
        amount
      });

      if (!cash) {
        throw new Error(AN_ERROR_OCCURRED);
      }

      return res.json({
        success: true,
        message: CASH_ADDED_SUCCESSFULLY,
        id: cash.id
      });
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: error.message
      });
    }
  }

  static async delete_(req, res) {
    try {
      const id = req.params.id;

      const result = await cashModel.findByIdAndRemove(id);

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: result.id
      });
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: INVALID_CREDENTIALS
      });
    }
  }
}
