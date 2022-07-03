import { compare, hash } from "bcrypt";
import logger from "../config/logger.js";
import { tenantModel } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  KIN_IS_REQUIRED,
  LOGIN_SUCCESSFUL,
  NOT_FOUND,
  TENANT_CREATED_SUCCESSFULLY,
  UPDATE_SUCCESSFUL
} from "../util/api.message.js";
import { rounds } from "../util/app.constant.js";

export default class TenantController {
  static async find(_req, res) {
    try {
      const tenants = await tenantModel.find().limit(10);

      if (!tenants) {
        throw new Error(NOT_FOUND);
      }

      return res.json(tenants);
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: error.message
      });
    }
  }

  static async findById(req, res) {
    try {
      const id = req.params.id;

      const tenant = await tenantModel.findById(id);

      if (!tenant) {
        throw new Error(NOT_FOUND);
      }

      return res.json(tenant);
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
      let {
        fullName,
        username,
        password,
        email,
        phone,
        dob,
        prevResidenceAddress,
        kin
      } = req.body;

      if (!kin.fullName || !kin.email || !kin.phone || !kin.residenceAddress) {
        throw new Error(KIN_IS_REQUIRED);
      }

      const hashedPassword = await hash(password, rounds);

      let tenant = new tenantModel({
        fullName,
        username,
        password: hashedPassword,
        email,
        phone,
        dob,
        prevResidenceAddress,
        kin
      });

      const result = await tenant.save();

      if (!error) {
        throw new Error(AN_ERROR_OCCURRED);
      }

      return res.json({
        success: true,
        message: TENANT_CREATED_SUCCESSFULLY,
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

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const result = tenantModel.findOne({ username });

      const same = await compare(password, result.password);

      if (!same) {
        // logger.error(error.message);
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }
      return res.json({
        success: true,
        message: LOGIN_SUCCESSFUL,
        id: result.id
      });
    } catch (error) {
      logger.error(error.message);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  }

  static async update(req, res) {
    try {
      const { email, phone, kin } = req.body;
      const id = req.params.id;

      const tenant = await tenantModel.findById(id);

      if (!tenant) {
        throw new Error(INVALID_CREDENTIALS);
      }

      if (email) {
        tenant.email = email;
      }

      if (phone) {
        tenant.phone = phone;
      }

      if (kin) {
        if (kin.email) {
          tenant.kin.email = kin.email;
        }

        if (kin.phone) {
          tenant.kin.phone = kin.phone;
        }
      }

      const updatedTenant = await tenant.save();

      if (!updatedTenant) {
        throw new Error(AN_ERROR_OCCURRED);
      }

      return res.json({
        success: true,
        message: UPDATE_SUCCESSFUL,
        id: updatedTenant.id
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

      const deletedTenant = await tenantModel.findByIdAndRemove(id);
      if (!deletedTenant) {
        throw new Error(INVALID_CREDENTIALS);
      }
      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: deletedTenant.id
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
