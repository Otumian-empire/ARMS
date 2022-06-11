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
  static find(_req, res) {
    tenantModel
      .find()
      .limit(10)
      .then((tenants) => {
        if (!tenants) {
          throw new Error(NOT_FOUND);
        }

        return res.json(tenants);
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message
        });
      });
  }

  static findById(req, res) {
    const id = req.params.id;

    tenantModel
      .findById(id)
      .then((tenant) => {
        if (!tenant) {
          throw new Error(NOT_FOUND);
        }

        return res.json(tenant);
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message
        });
      });
  }

  static create(req, res) {
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
      return res.json({
        success: false,
        message: KIN_IS_REQUIRED
      });
    }

    hash(password, rounds, (error, hashedPassword) => {
      if (error) {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message
        });
      }

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

      tenant.save((error, result) => {
        if (error) {
          logger.error(error);

          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED
          });
        }

        return res.json({
          success: true,
          message: TENANT_CREATED_SUCCESSFULLY,
          id: result.id
        });
      });
    });
  }

  static login(req, res) {
    const { username, password } = req.body;

    tenantModel
      .findOne({ username })
      .then((result) => {
        compare(password, result.password, (error, same) => {
          if (error || !same) {
            // logger.error(error);
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
        });
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED
        });
      });
  }

  static update(req, res) {
    const { email, phone, kin } = req.body;
    const id = req.params.id;

    tenantModel
      .findById(id)
      .then((tenant) => {
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

        tenant.save((error, updatedTenant) => {
          if (error) {
            logger.error(error);

            return res.json({
              success: false,
              message: AN_ERROR_OCCURRED
            });
          }

          return res.json({
            success: true,
            message: UPDATE_SUCCESSFUL,
            id: updatedTenant.id
          });
        });
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message
        });
      });
  }

  static delete_(req, res) {
    const id = req.params.id;

    tenantModel.findByIdAndRemove(id, (error, deletedTenant) => {
      if (error) {
        logger.error(error);

        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: deletedTenant.id
      });
    });
  }
}
