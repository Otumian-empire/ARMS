import logger from "../config/logger.js";
import { PAGINATION } from "../util/app.constant.js";
import client from "./connection.js";

export default class ApartmentCache {
  static async findById(req, res, next) {
    try {
      const id = req.params.id;

      const redisKey = `APARTMENT:${id}`;
      const apartment = await client.get(redisKey);

      if (apartment) {
        return res.json(JSON.parse(apartment));
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

      const redisKey = `APARTMENT:${page}:${pageSize}`;
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
