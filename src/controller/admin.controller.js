import { compare, hash } from "bcrypt";
import logger from "../config/logger.js";
import { adminModel } from "../model/index.js";
import {
  ADMIN_CREATED_SUCCESSFULLY,
  AN_ERROR_OCCURRED,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  NOT_FOUND,
  UPDATE_SUCCESSFUL,
} from "../util/api.message.js";
import { rounds } from "../util/app.constant.js";

export default class AdminController {
  static async findById(req, res) {
    const id = req.params.id;

    try {
      const admin = await adminModel.findById(id).select("-password -__v");

      if (!admin) {
        throw new Error(NOT_FOUND);
      }

      return res.json(admin);
    } catch (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: error.message,
      });
    }
  }

  static async create(req, res) {
    const { username, password, email } = req.body;

    try {
      const hashedPassword = await hash(password, rounds);

      let admin = new adminModel({
        username,
        email,
        password: hashedPassword,
      });

      const result = await admin.save();

      return res.json({
        success: true,
        message: ADMIN_CREATED_SUCCESSFULLY,
        id: result.id,
      });
    } catch (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const result = await adminModel.findOne({ username });

      if (!result) {
        throw new Error(NOT_FOUND);
      }

      const same = await compare(password, result.password);

      if (!same) {
        throw new Error(INVALID_CREDENTIALS)
      }

      return res.json({
        success: true,
        message: LOGIN_SUCCESSFUL,
        id: result.id,
      });
    } catch (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: error.message,
      });
    }
  }

  static async update(req, res) {
    const id = req.params.id;
    const email = req.body.email;

    try {
      const result = await adminModel.findById(id);
      if (!result) {
        throw new Error(NOT_FOUND);
      }

      if (email) {
        result.email = email;
      }

      const updatedResult = await result.save();

      if (!updatedResult) {
        throw new Error(AN_ERROR_OCCURRED);
      }

      return res.json({
        success: true,
        message: UPDATE_SUCCESSFUL,
        id: updatedResult.id,
      });
    } catch (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: error.message,
      });
    }
  }

  static async delete_(req, res) {
    const id = req.params.id;

    try {
      const result = await adminModel.findByIdAndDelete(id);

      if (!result) {
        throw new Error(NOT_FOUND);
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: result.id,
      });
    } catch (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: error.message,
      });
    }
  }
}