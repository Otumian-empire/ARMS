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
const logger = require("../config/logger");

module.exports = {
  // TODO: use try and catch and throw an error if ID is not passed or defined
  findById: (req, res) => {
    const id = req.params.id;

    Admin.findById(id)
      .select("-password -__v")
      .then((admin) => {
        if (!admin) {
          throw new Error(NOT_FOUND);
        }

        return res.json(admin);
      })
      .catch((error) => {
        logger.error(error);

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
        logger.error(error);

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
        if (error) {
          logger.error(error);

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
          if (error) {
            logger.error(error);

            return res.json({
              success: false,
              message: INVALID_CREDENTIALS,
            });
          }

          return res.json({
            success: true,
            message: LOGIN_SUCCESSFUL,
            id: result.id,
          });
        });
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  update: (req, res) => {
    const id = req.params.id;
    const email = req.body.email;

    Admin.findById(id)
      .then((result) => {
        if (!result) {
          throw new Error(NOT_FOUND);
        }

        if (email) {
          result.email = email;
        }

        result.save((error, updatedResult) => {
          if (error) {
            logger.error(error);

            return res.json({
              success: false,
              message: AN_ERROR_OCCURRED,
            });
          }

          return res.json({
            success: true,
            message: UPDATE_SUCCESSFUL,
            id: updatedResult.id,
          });
        });
      })
      .catch((error) => {
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
  delete_: (req, res) => {
    const id = req.params.id;

    Admin.findByIdAndDelete(id)
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
        logger.error(error);

        return res.json({
          success: false,
          message: error.message,
        });
      });
  },
};
