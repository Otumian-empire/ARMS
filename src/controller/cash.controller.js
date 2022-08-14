import logger from "../config/logger.js";
import { adminModel, cashModel, tenantModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  FORBIDDEN,
  INVALID_CREDENTIALS
} from "../util/api.message.js";
import { generateToken, isAuthenticUser } from "../util/function.js";

export default class CashController {
  static async find(req, res) {
    // TODO: Add caching here
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const { limit, skip } = pagination(page, pageSize);

      const cashes = await cashModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .limit(10);

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
    // TODO: Add caching here
    try {
      const id = req.params.id;

      if (!id) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const results = await cashModel
        .find({ tenantId: id })
        .select("-__v")
        .limit(10);

      return res.json(results);
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
      const payload = req.payload;
      req.payload = undefined;

      const isAuth = await isAuthenticUser(tenantModel, payload);

      if (!isAuth) {
        return res.status(403).json({ success: false, message: FORBIDDEN });
      }

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
      const payload = req.payload;
      req.payload = undefined;

      const isAuth = await isAuthenticUser(adminModel, payload);

      if (!isAuth) {
        return res.status(403).json({ success: false, message: FORBIDDEN });
      }

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
