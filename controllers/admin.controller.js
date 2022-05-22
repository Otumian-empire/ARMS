const bcrypt = require("bcrypt");

const { Admin } = require("../models/admin");
const { rounds } = require("../utils/app.constant");
const {
  ADMIN_CREATED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  NOT_FOUND,
  LOGIN_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  AN_ERROR_OCCURRED,
  DELETED_SUCCESSFULLY,
} = require("../utils/api.messages");

module.exports = {
  // TODO: use try and catch and throw an error if ID is not passed or defined
  findById: (req, res) => {
    const adminId = req.params.adminId;

    Admin.findById(adminId)
      .select("-password -__v")
      .then((admin) => {
        if (!admin) {
          throw new Error(NOT_FOUND);
        }

        return res.json(admin);
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  // TODO: use try-catch and async await
  create: (req, res) => {
    let { username, password, email } = req.body;

    bcrypt.hash(password, rounds, (error, hashPassword) => {
      if (error) {
        return res.json({
          success: false,
          message: AN_ERROR_OCCURRED,
        });
      }

      let admin = new Admin({
        username,
        email,
        password: hashPassword,
      });

      admin.save((error, result) => {
        if (error || !result) {
          return res.json({
            success: false,
            message: AN_ERROR_OCCURRED,
          });
        }

        return res.json({
          success: true,
          message: ADMIN_CREATED_SUCCESSFULLY,
          id: result.id,
        });
      });
    });
  },
  // TODO: use jwt for login
  login: (req, res) => {
    const { username, password } = req.body;

    Admin.findOne({ username })
      .then((result) => {
        if (!result) {
          throw new Error(NOT_FOUND);
        }

        bcrypt.compare(password, result.password, (error, same) => {
          if (error || !same) {
            throw new Error(INVALID_CREDENTIALS);
          }

          return res.json({
            success: true,
            message: LOGIN_SUCCESSFUL,
            id: result.id,
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
  update: (req, res) => {
    const email = req.body.email;
    const adminId = req.params.adminId;

    Admin.findById(adminId)
      .then((result) => {
        if (!result) {
          throw new Error(NOT_FOUND);
        }

        result.email = email;

        result.save((error, updatedResult) => {
          if (error || !updatedResult) {
            throw new Error(AN_ERROR_OCCURRED);
          }

          return res.json({
            success: true,
            message: UPDATE_SUCCESSFUL,
            id: updatedResult.id,
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
    const adminId = req.params.adminId;

    Admin.findByIdAndDelete(adminId)
      .then((result) => {
        if (!result) {
          throw new Error(NOT_FOUND);
        }

        return res.json({
          success: true,
          message: DELETED_SUCCESSFULLY,
          id: result.id,
        });
      })
      .catch((error) => {
        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
};
