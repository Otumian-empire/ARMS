const bcrypt = require("bcrypt");

const { rounds } = require("../utils/app.constant");
const Tenant = require("../models/tenant").Tenant;

module.exports = {
  find: (req, res) => {
    Tenant.find()
      .limit(10)
      .exec((err, tenants) => {
        if (err)
          return res.json({
            success: false,
            message: err,
          });

        return res.json({ tenants });
      });
  },
  findOne: (req, res) => {
    Tenant.findOne({ _id: req.params.tenant_id })
      .then((tenant) => res.json({ tenant }))
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  create: (req, res) => {
    let {
      full_name,
      username,
      password,
      email,
      phone,
      date_of_birth,
      address_of_previous_residence,
      kins_full_name,
      kins_email,
      kins_phone,
      kins_residence_address,
    } = req.body;

    bcrypt.hash(password, rounds, (err, hashPwd) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      }

      Tenant.create({
        full_name,
        username,
        password: hashPwd,
        email,
        phone,
        date_of_birth,
        address_of_previous_residence,
        kins_full_name,
        kins_email,
        kins_phone,
        kins_residence_address,
      })
        .then((result) => {
          if (result)
            return res.json({
              success: true,
              message: "Tenant added successfully",
              id: result._id,
            });
        })
        .catch((err) => {
          console.log(err);
          return res.json({
            success: false,
            message: err,
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
