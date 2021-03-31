require("dotenv").config();

const tenantRouter = require("express").Router();
const bcrypt = require("bcrypt");
const rounds = parseInt(process.env.SALT_ROUNDS, 12);
const tenantsDB = require("../models/tenants");

// fetch all tenants
tenantRouter.get("/", (req, res) => {
  tenantsDB.collection
    .find()
    .toArray()
    .then((tenants) => res.json({ tenants }))
    .catch((err) => {
      console.log(err);
      return res.json({
        success: false,
        message: err,
      });
    });
});

// fetch a tenant
tenantRouter.get("/:tenant_id", (req, res) => {
  tenantsDB
    .findOne({ _id: req.params.tenant_id })
    .then((tenant) => res.json({ tenant }))
    .catch((err) => {
      console.log(err);
      return res.json({
        success: false,
        message: err,
      });
    });
});

// create a tenant - add tenant data
tenantRouter.post("/signup", (req, res) => {
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

    tenantsDB
      .create({
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
});

// login tenant - they can change their data
tenantRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  bcrypt.compare;
  tenantsDB
    .findOne({ username })
    .then((result) => {
      console.log(result);

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
});

// update - tenant may update only their emaila and phone number
// this applies for the next of kins
tenantRouter.put("/update/:tenant_id", (req, res) => {
  const { email, phone, kins_email, kins_phone } = req.body;
  const tenant_id = req.params.tenant_id;

  tenantsDB.findOne({ _id: tenant_id }, (err, tenant) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, msg: err });
    }

    if (!tenant) return res.json({ success: false, msg: "Tenant no found" });

    tenant.email = email;
    tenant.phone = phone;
    tenant.kins_email = kins_email;
    tenant.kins_phone = kins_phone;

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
});

// delete tenant data - admin privileges is needed
tenantRouter.delete("/delete/:tenant_id", (req, res) => {
  const tenant_id = req.params.tenant_id;
  
  tenantsDB.findOneAndRemove({ _id: tenant_id }, (err, deletedTenant) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, msg: err });
    }

    return res.json({
      success: true,
      msg: "Tenant details deleted successfully",
      id: deletedTenant._id,
    });
  });
});

module.exports = tenantRouter;