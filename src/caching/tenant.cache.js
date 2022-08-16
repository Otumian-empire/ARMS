import logger from "../config/logger.js";
import { PAGINATION } from "../util/app.constant.js";
import client from "./connection.js";

export default class TenantCache {
  static async findById(req, res, next) {
    try {
      const id = req.params.id;

      const redisKey = `TENANT:${id}`;
      const rent = await client.get(redisKey);

      if (rent) {
        return res.json(JSON.parse(rent));
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

      const redisKey = `TENANT:${page}:${pageSize}`;
      const tenants = await client.get(redisKey);

      if (tenants) {
        return res.json(JSON.parse(tenants));
      }

      return next();
    } catch (error) {
      logger.warn(error.message);
      return next();
    }
  }
}
