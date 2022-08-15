import logger from "../config/logger.js";
import { PAGINATION } from "../util/app.constant.js";
import client from "./connection.js";

export default class RentCache {
  static async findOneByRentId(req, res, next) {
    try {
      const id = req.params.id;

      const redisKey = `RENT:${id}`;
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

      const redisKey = `RENT:${page}:${pageSize}`;
      const rents = await client.get(redisKey);

      if (rents) {
        return res.json(JSON.parse(rents));
      }

      return next();
    } catch (error) {
      logger.warn(error.message);
      return next();
    }
  }
}
