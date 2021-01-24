require("dotenv").config();

const tenantRouter = require("express").Router();
const bcrypt = require("bcrypt");
const rounds = parseInt(process.env.SALT_ROUNDS, 12);
const tenantsDB = require("../models/tenants");

// fetch all tenants
tenantRouter.get("/", (req, res) => {
  tenantsDB.find({}).toArray(function (err, tenants) {
    if (err) throw err;
    console.log(result);
    return res.json({ tenants });
  });
  // const tenants = tenantsDB.find({}).toArray();
  // // tenants.toArray();

  // return res.json({ tenants });
});

// fetch a tenant
tenantRouter.get("/:tenant_id", (req, res) => {
  return res.json({
    message: "Tenant route",
    // tenant: tenantsDB.findById(req.params.tenant_id),
    id: req.params.tenant_id,
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

// update
tenantRouter.put("/update/:tenant_id", (req, res) => {
  console.log(req.params.tenant_id);
  return res.json({ message: "Tenant route" });
});

// delete tenant data - admin privileges is needed
tenantRouter.delete("/delete/:tenant_id", (req, res) => {
  console.log(req.params.tenant_id);
  return res.json({ message: "Tenant route" });
});

module.exports = tenantRouter;
