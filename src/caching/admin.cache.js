import logger from "../config/logger.js";
import client from "./connection.js";

export default class AdminCache {
  static async findById(req, res, next) {
    try {
      const id = req.params.id;

      const redisKey = `ADMIN:${id}`;
      const admin = await client.get(redisKey);

      if (admin) {
        return res.json(JSON.parse(admin));
      }

      return next();
    } catch (error) {
      logger.warn(error.message);
      return next();
    }
  }
}
