const bcrypt = require("bcrypt");

const Tenant = require("../models/tenant").Tenant;
const { rounds } = require("../utils/app.constant");
const {
  NOT_FOUND,
  TENANT_CREATED_SUCCESSFULLY,
  AN_ERROR_OCCURRED,
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
        message: err,
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
        bcrypt.compare(password, result.password, (err, same) => {
          if (err)
            return res.json({
              success: false,
              msg: err,
            });

          if (!same)
            return res.json({
              success: false,
              msg: "Invalid credentials",
            });

          return res.json({
            success: true,
            message: "Tenant logged-in successfully",
            id: result._id,
          });
        });
      })
      .catch((err) => {
        return res.json({
          success: false,
          message: "No tenant found",
        });
      });
  },
  update: (req, res) => {
    const { email, phone, kins_email, kins_phone } = req.body;
    const tenant_id = req.params.tenant_id;

    Tenant.findOne({ _id: tenant_id }, (err, tenant) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!tenant) return res.json({ success: false, msg: "Tenant no found" });

      if (email !== undefined) tenant.email = email;
      if (phone !== undefined) tenant.phone = phone;
      if (kins_email !== undefined) tenant.kins_email = kins_email;
      if (kins_phone !== undefined) tenant.kins_phone = kins_phone;

      tenant.save((err, updatedTenant) => {
        if (err) {
          console.log(err);
          return res.json({ success: false, msg: err });
        }

        return res.json({
          success: true,
          msg: "Tenant details updated",
          id: updatedTenant._id,
        });
      });
    });
  },
  delete_: (req, res) => {
    const tenant_id = req.params.tenant_id;

    Tenant.findOneAndRemove({ _id: tenant_id }, (err, deletedTenant) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!deletedTenant)
        return res.json({ success: false, msg: "tenant no found" });

      return res.json({
        success: true,
        msg: "Tenant details deleted successfully",
        id: deletedTenant._id,
      });
    });
  },
};
