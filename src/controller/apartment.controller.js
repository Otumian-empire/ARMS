import { Cache } from "../caching/index.js";
import logger from "../config/logger.js";
import { apartmentModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  APARTMENT_CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  INVALID_PRICE,
  INVALID_ROOM_NUMBER,
  NOT_FOUND,
  UPDATE_SUCCESSFUL
} from "../util/api.message.js";
import { PAGINATION, REDIS_TTL } from "../util/app.constant.js";
import {
  isValidPrice,
  isValidRoomNumber,
  pagination
} from "../util/function.js";

export default class ApartmentController {
  static async find(req, res) {
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const { limit, skip } = pagination(page, pageSize);

      const apartments = await apartmentModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-__v");

      const redisKey = `APARTMENT:${page}:${pageSize}`;
      await Cache.setEx(redisKey, REDIS_TTL, JSON.stringify(apartments));

      return res.json(apartments);
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id;
      const apartment = await apartmentModel.findById(id).select("-__v");

      if (!apartment) {
        return res.json({
          success: false,
          message: NOT_FOUND
        });
      }

      const redisKey = `APARTMENT:${id}`;
      await Cache.setEx(redisKey, REDIS_TTL, JSON.stringify(apartment));

      return res.json(apartment);
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
      let { roomNumber, description, price } = req.body;

      if (!isValidRoomNumber(roomNumber)) {
        return res.json({
          success: false,
          message: INVALID_ROOM_NUMBER
        });
      }

      if (!isValidPrice(price)) {
        return res.json({
          success: false,
          message: INVALID_PRICE
        });
      }

      const apartment = new apartmentModel({
        roomNumber,
        description,
        price: Number(price)
      });

      const result = await apartment.save();

      if (!result) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED
        });
      }

      return res.json({
        success: true,
        message: APARTMENT_CREATED_SUCCESSFULLY,
        id: result.id
      });
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const { roomNumber, description, price } = req.body;

      const apartment = await apartmentModel.findById(id);

      if (!apartment) {
        return res.json({
          success: false,
          message: NOT_FOUND
        });
      }

      if (roomNumber) {
        if (!isValidRoomNumber(roomNumber)) {
          return res.json({
            success: false,
            message: INVALID_ROOM_NUMBER
          });
        }

        apartment.roomNumber = roomNumber;
      }

      if (description) {
        apartment.description = description;
      }

      if (price) {
        if (!isValidPrice(price)) {
          return res.json({
            success: false,
            message: INVALID_PRICE
          });
        }

        apartment.price = Number(price);
      }

      const result = await apartment.save();

      if (!result) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED
        });
      }

      return res.json({
        success: true,
        message: UPDATE_SUCCESSFUL,
        id: result.id
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

      const result = await apartmentModel.findByIdAndDelete(id);

      if (!result) {
        return res.json({
          success: false,
          message: NOT_FOUND
        });
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: result.id
      });
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: error.message
      });
    }
  }
}
