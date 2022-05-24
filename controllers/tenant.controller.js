const bcrypt = require("bcrypt");

const Tenant = require("../models/tenant").Tenant;
const { rounds } = require("../utils/app.constant");
const {
  NOT_FOUND,
  TENANT_CREATED_SUCCESSFULLY,
  AN_ERROR_OCCURRED,
  INVALID_CREDENTIALS,
  UPDATE_SUCCESSFUL,
  DELETED_SUCCESSFULLY,
  KIN_IS_REQUIRED,
} = require("../utils/api.messages");

module.exports = {
  find: (_req, res) => {
    Tenant.find()
      .limit(10)
      .exec()
      .then((tenants) => {
        if (!tenants) {
          throw new Error(NOT_FOUND);
        }

        return res.json(tenants);
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  findById: (req, res) => {
    const tenantId = req.params.tenantId;
    Tenant.findById(tenantId)
      .then((tenant) => res.json(tenant))
      .catch((error) => {
        console.log(error);
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  create: (req, res) => {
    let {
      fullName,
      username,
      password,
      email,
      phone,
      dob,
      prevResidenceAddress,
      kin,
    } = req.body;

    if (!kin.fullName || !kin.email || !kin.phone || !kin.residenceAddress) {
      return res.json({
        success: false,
        message: KIN_IS_REQUIRED,
      });
    }

    bcrypt.hash(password, rounds, (error, hashedPassword) => {
      if (error || !hashedPassword) {
        return res.json({
          success: false,
          message: error.message,
        });
      }

      let tenant = new Tenant({
        fullName,
        username,
        password: hashedPassword,
        email,
        phone,
        dob,
        prevResidenceAddress,
        kin,
      });

      tenant.save((error, result) => {
        if (error || !result) {
          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED,
          });
        }

        return res.json({
          success: true,
          message: TENANT_CREATED_SUCCESSFULLY,
          id: result.id,
        });
      });
    });
  },
  login: (req, res) => {
    const { username, password } = req.body;

    Tenant.findOne({ username })
      .then((result) => {
        bcrypt.compare(password, result.password, (error, same) => {
          if (error || !same) {
            return res.json({
              success: false,
              message: INVALID_CREDENTIALS,
            });
          }

          return res.json({
            success: true,
            message: "Tenant logged-in successfully",
            id: result._id,
          });
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      });
  },
  update: (req, res) => {
    const { email, phone, kin } = req.body;
    const tenantId = req.params.tenantId;

    Tenant.findById(tenantId)
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
          if (error || !updatedTenant) {
            return res.json({
              success: false,
              message: AN_ERROR_OCCURRED,
            });
          }

          return res.json({
            success: true,
            message: UPDATE_SUCCESSFUL,
            id: updatedTenant.id,
          });
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  delete_: (req, res) => {
    const tenantId = req.params.tenantId;

    Tenant.findByIdAndRemove(tenantId, (error, deletedTenant) => {
      if (error || !deletedTenant) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS,
        });
      }

      return res.json({
        success: true,
        message: DELETED_SUCCESSFULLY,
        id: deletedTenant.id,
      });
    });
  },
};
