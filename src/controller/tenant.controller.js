import { compare, hash } from "bcrypt";
import Auth from "../config/auth.js";
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
import { isAuthenticUser } from "../util/function.js";

export default class TenantController {
  static async find(req, res) {
    // TODO: Add caching here
    try {
      const page = parseInt(req.query.page) || PAGINATION.page;
      const pageSize = parseInt(req.query.pageSize) || PAGINATION.pageSize;

      const { limit, skip } = pagination(page, pageSize);

      const tenants = await tenantModel
        .find()
        .skip(skip)
        .limit(limit)
        .select("-password");

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
    // TODO: Add caching here
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

      if (!result) {
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

      const result = await tenantModel.findOne({ username });

      if (!result) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const same = await compare(password, result.password);

      if (!same) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const token = await Auth.generateJWT({
        id: result.id,
        username: result.username,
        email: result.email
      });

      return res.json({
        success: true,
        message: LOGIN_SUCCESSFUL,
        id: result.id,
        auth: token
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
      const payload = req.payload;
      req.payload = undefined;

      const isAuth = await isAuthenticUser(tenantModel, payload);

      if (!isAuth) {
        return res.status(403).json({ success: false, message: FORBIDDEN });
      }

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
      const payload = req.payload;
      req.payload = undefined;

      const isAuth = await isAuthenticUser(tenantModel, payload);

      if (!isAuth) {
        return res.status(403).json({ success: false, message: FORBIDDEN });
      }

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
