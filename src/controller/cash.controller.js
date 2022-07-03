import Auth from "../config/auth.js";
import logger from "../config/logger.js";
import { adminModel, cashModel, tenantModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  CASH_ADDED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  FORBIDDEN,
  INVALID_CREDENTIALS,
  REQUEST_TOKEN
} from "../util/api.message.js";
import { generateToken, isAuthenticUser } from "../util/function.js";

export default class CashController {
  static async find(_req, res) {
    try {
      const cashes = await cashModel.find().select("-__v").limit(10);

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
      const jwt = req.token;
      req.token = undefined;

      const payload = await Auth.verifyJWT(jwt);

      if (payload.hasExpired) {
        throw new Error(REQUEST_TOKEN);
      }

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

      const token = generateToken();

      const tenant = await tenantModel.findById(id);

      if (!tenant) {
        throw new Error(INVALID_CREDENTIALS);
      }

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
      const jwt = req.token;
      req.token = undefined;

      const payload = await Auth.verifyJWT(jwt);

      if (payload.hasExpired) {
        throw new Error(REQUEST_TOKEN);
      }

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
