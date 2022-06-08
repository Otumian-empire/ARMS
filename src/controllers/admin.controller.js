import { compare, hash } from "bcrypt";

import { Admin } from "../models/index.js";
import {
  ADMIN_CREATED_SUCCESSFULLY,
  AN_ERROR_OCCURRED,
  DELETED_SUCCESSFULLY,
  INVALID_CREDENTIALS,
  LOGIN_SUCCESSFUL,
  NOT_FOUND,
  UPDATE_SUCCESSFUL,
} from "../utils/api.messages.js";

import logger from "../config/logger.js";
import { rounds } from "../utils/app.constant.js";

export function findById(req, res) {
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
}

export function create(req, res) {
  let { username, password, email } = req.body;

  hash(password, rounds, (error, hashPassword) => {
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
}

export function login(req, res) {
  const { username, password } = req.body;

  Admin.findOne({ username })
    .then((result) => {
      if (!result) {
        throw new Error(NOT_FOUND);
      }

      compare(password, result.password, (error, same) => {
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
}

export function update(req, res) {
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
}

export function delete_(req, res) {
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
}
