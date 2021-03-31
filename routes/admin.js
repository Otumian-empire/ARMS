require("dotenv").config();

const adminRouter = require("express").Router();
const bcrypt = require("bcrypt");
const rounds = parseInt(process.env.SALT_ROUNDS, 12);
const { Admin } = require("../models/admin");

// fetch an admin
adminRouter.get("/:admin_id", (req, res) => {
  Admin.findOne({ _id: req.params.admin_id })
    .then((admin) => res.json({ admin }))
    .catch((err) => {
      console.log(err);
      return res.json({
        success: false,
        message: err,
      });
    });
});

adminRouter.get("/", (req, res) => {
  Admin.find()
    .limit(10)
    .exec((err, admins) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      }

      return res.json({ admins });
    });
});

// create a admin - add admin data
adminRouter.post("/", (req, res) => {
  let { username, password, email } = req.body;

  bcrypt.hash(password, rounds, (err, hashPwd) => {
    if (err) {
      console.log(err);

      return res.json({
        success: false,
        message: err,
      });
    }

    let admin = new Admin({ username, email, password: hashPwd });

    admin.save((err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      }

      return res.json({
        success: true,
        message: "Admin added successfully",
        id: result._id,
      });
    });
  });
});

// login admin - they can change their data
adminRouter.post("/login", (req, res) => {
  const { username, password, email } = req.body;

  Admin.findOne({ username })
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
          message: "Admin logged-in successfully",
          id: result._id,
        });
      });
    })
    .catch((err) => {
      return res.json({
        success: false,
        message: "No admin found",
      });
    });
});

// update - admin may update only the email
adminRouter.put("/:admin_id", (req, res) => {
  const email = req.body.email;
  const admin_id = req.params.admin_id;

  Admin.findOne({ _id: admin_id }, (err, admin) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, msg: err });
    }

    if (!admin) return res.json({ success: false, msg: "Admin no found" });

    admin.email = email;

    admin.save((err, updatedAdmin) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      return res.json({
        success: true,
        msg: "Admin details updated",
        id: updatedAdmin._id,
      });
    });
  });
});

// delete admin data - admin privileges is needed
adminRouter.delete("/:admin_id", (req, res) => {
  const admin_id = req.params.admin_id;

  Admin.findOneAndRemove({ _id: admin_id }, (err, deletedTenant) => {
    if (err) {
      console.log(err);
      return res.json({ success: false, msg: err });
    }

    if (!deletedTenant)
      return res.json({ success: false, msg: "admin no found" });

    return res.json({
      success: true,
      msg: "Admin details deleted successfully",
      id: deletedTenant._id,
    });
  });
});

module.exports = { adminRouter };
