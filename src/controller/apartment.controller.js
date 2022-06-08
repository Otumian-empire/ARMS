import logger from "../config/logger.js";
import { Apartment } from "../model/index.js";
import {
  AN_ERROR_OCCURRED,
  APARTMENT_CREATED_SUCCESSFULLY,
  DELETED_SUCCESSFULLY,
  INVALID_PRICE,
  INVALID_ROOM_NUMBER,
  NOT_FOUND,
  UPDATE_SUCCESSFUL,
} from "../util/api.message.js";
import { isValidPrice, isValidRoomNumber } from "../util/function.js";

export function find(_req, res) {
  Apartment.find()
    .limit(10)
    .select("-__v")
    .then((apartments) => res.json(apartments))
    .catch((error) => {
      logger.error(error);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    });
}

export function findById(req, res) {
  const id = req.params.id;

  Apartment.findById(id)
    .select("-__v")
    .then((apartment) => {
      if (!apartment) {
        throw new Error(NOT_FOUND);
      }

      return res.json(apartment);
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
  let { roomNumber, description, price } = req.body;

  if (!isValidRoomNumber(roomNumber)) {
    return res.json({
      success: false,
      message: INVALID_ROOM_NUMBER,
    });
  }

  if (!isValidPrice(price)) {
    return res.json({
      success: false,
      message: INVALID_PRICE,
    });
  }

  const apartment = new Apartment({
    roomNumber,
    description,
    price: Number(price),
  });

  apartment.save((error, result) => {
    if (error) {
      logger.error(error);

      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED,
      });
    }

    return res.json({
      success: true,
      message: APARTMENT_CREATED_SUCCESSFULLY,
      id: result.id,
    });
  });
}

export function update(req, res) {
  const id = req.params.id;
  const { roomNumber, description, price } = req.body;

  Apartment.findById(id)
    .then((apartment) => {
      if (!apartment) {
        throw new Error(NOT_FOUND);
      }

      if (roomNumber) {
        if (!isValidRoomNumber(roomNumber)) {
          return res.json({
            success: false,
            message: INVALID_ROOM_NUMBER,
          });
        }

        apartment.roomNumber = roomNumber;
      }

      if (description) {
        apartment.description = description;
      }

      if (price) {
        if (!isValidPrice(price)) {
          return res.json({
            success: false,
            message: INVALID_PRICE,
          });
        }

        apartment.price = Number(price);
      }

      apartment.save((error, updatedApartment) => {
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
          id: updatedApartment.id,
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

  Apartment.findByIdAndDelete(id)
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
