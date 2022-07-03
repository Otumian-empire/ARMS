import logger from "../config/logger.js";
import {
  apartmentModel,
  cashModel,
  rentModel,
  tenantModel
} from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  APARTMENT_IS_OCCUPIED,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  NOT_FOUND,
  RENT_ADDED_SUCCESSFULLY
} from "../util/api.message.js";

export default class RentController {
  static async find(_req, res) {
    try {
      const rents = await rentModel.find().limit(10).select("-__v");

      return res.json(rents);
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  }

  static async findOneByRentId(req, res) {
    try {
      const id = req.params.id;
      const rent = await rentModel.findById(id).select("-__v");

      if (!rent) {
        throw new Error(NOT_FOUND);
      }
      return res.json(rent);
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
      const { apartmentId, cashId } = req.body;

      if (!id || !apartmentId || !cashId) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const apartment = await apartmentModel.findById(apartmentId);
      if (!apartment) {
        throw new Error(INVALID_CREDENTIALS);
      }

      const tenant = await tenantModel.findById(id);

      if (!tenant) {
        throw new Error(INVALID_CREDENTIALS);
      }

      const cash = await cashModel.find({ _id: cashId, tenantId: id });

      if (!cash) {
        throw new Error(NOT_FOUND);
      }

      const isOccupied = await rentModel.findOne({ apartmentId });

      if (isOccupied) {
        throw new Error(APARTMENT_IS_OCCUPIED);
      }

      // TODO: add a field to the cash table that indicates the
      // status of cash. we can not rent with an apartment with
      // a used cash ID
      const rent = await rentModel.create({
        tenantId: id,
        apartmentId,
        cashId
      });

      if (!rent) {
        throw new Error(AN_ERROR_OCCURRED);
      }

      return res.json({
        success: true,
        message: RENT_ADDED_SUCCESSFULLY,
        id: rent.id
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

      const result = await rentModel.findByIdAndDelete(id);

      if (!result) {
        throw new Error(NOT_FOUND);
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: result.id
      });
    } catch (error) {
      logger.error(error.message);

      if (error) {
        return res.json({
          success: false,
          message: error.message
        });
      }
    }
  }
}
