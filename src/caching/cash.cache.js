import logger from "../config/logger.js";
import { PAGINATION } from "../util/app.constant.js";
import client from "./connection.js";

export default class CashCache {
  static async findByTenantId(req, res, next) {
    try {
      const id = req.params.id;
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const redisKey = `CASH:${id}:${page}:${pageSize}`;
      const cash = await client.get(redisKey);

      if (cash) {
        return res.json(JSON.parse(cash));
      }

      return next();
    } catch (error) {
      logger.warn(error.message);
      return next();
    }
  }

  static async find(req, res, next) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const redisKey = `CASH:${page}:${pageSize}`;
      const apartments = await client.get(redisKey);

      if (apartments) {
        return res.json(JSON.parse(apartments));
      }

      return next();
    } catch (error) {
      logger.warn(error.message);
      return next();
    }
  }
}
