const Joi = require("joi");
const { joiPassword } = require("joi-password");

const {
  INVALID_CREDENTIALS,
  ID_PARAMETER_REQUIRED,
  ROOM_NUMBER_REQUIRED,
  PRICE_REQUIRED,
  AMOUNT_REQUIRED,
  USERNAME_REQUIRED,
  EMAIL_REQUIRED,
  FULL_NAME_REQUIRED,
  DOB_REQUIRED,
  PHONE_REQUIRED,
  PREVIOUS_ADDRESS_REQUIRED,
  PASSWORD_REQUIRED,
} = require("../utils/api.messages");

const { MINIMUM_PASSWORD_SIZE, ONE } = require("../utils/app.constant");

const schemas = {
  idRequestParams: Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .rule({
        message: ID_PARAMETER_REQUIRED,
      })
      .required(),
  }),
  //   paginationQuery: Joi.object().keys({
  //     page: Joi.number().integer().positive().default(PAGINATION.PAGE),
  //     pageSize: Joi.number().integer().positive().default(PAGINATION.PAGE_SIZE),
  //   }),
  loginRequestBody: Joi.object().keys({
    username: Joi.string()
      .trim()
      .rule({
        message: INVALID_CREDENTIALS,
      })
      .required(),
    password: joiPassword
      .string()
      .min(MINIMUM_PASSWORD_SIZE)
      .rule({
        message: INVALID_CREDENTIALS,
      })
      .minOfLowercase(1)
      .rule({
        message: INVALID_CREDENTIALS,
      })
      .minOfUppercase(1)
      .rule({
        message: INVALID_CREDENTIALS,
      })
      .minOfNumeric(1)
      .rule({
        message: INVALID_CREDENTIALS,
      })
      .required(),
  }),
  adminSignupRequestBody: Joi.object().keys({
    username: Joi.string()
      .trim()
      .rule({
        message: USERNAME_REQUIRED,
      })
      .required(),
    password: joiPassword
      .string()
      .min(MINIMUM_PASSWORD_SIZE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfLowercase(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfUppercase(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfNumeric(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .required(),
    email: Joi.string()
      .email()
      .trim()
      .rule({
        message: EMAIL_REQUIRED,
      })
      .required(),
  }),
  adminUpdateRequestBody: Joi.object().keys({
    email: Joi.string().email().trim(),
  }),
  apartmentCreateRequestBody: Joi.object().keys({
    roomNumber: Joi.string()
      .token()
      .trim()
      .rule({
        message: ROOM_NUMBER_REQUIRED,
      })
      .required(),
    description: Joi.string().trim().required(),
    price: Joi.number()
      .integer()
      .rule({
        message: PRICE_REQUIRED,
      })
      .required(),
  }),
  apartmentUpdateRequestBody: Joi.object().keys({
    roomNumber: Joi.string().token().trim(),
    description: Joi.string().trim(),
    price: Joi.number().integer(),
  }),
  cashCreateRequestBody: Joi.object().keys({
    amount: Joi.number()
      .integer()
      .rule({
        message: AMOUNT_REQUIRED,
      })
      .required(),
  }),
  rentCreateRequestBody: Joi.object().keys({
    apartmentId: Joi.string()
      .alphanum()
      .rule({
        message: ID_PARAMETER_REQUIRED,
      })
      .required(),
    cashId: Joi.string()
      .alphanum()
      .rule({
        message: ID_PARAMETER_REQUIRED,
      })
      .required(),
  }),
  tenantCreateRequestBody: Joi.object().keys({
    fullName: Joi.string()
      .trim()
      .rule({
        message: FULL_NAME_REQUIRED,
      })
      .required(),
    username: Joi.string()
      .trim()
      .rule({
        message: USERNAME_REQUIRED,
      })
      .required(),
    password: joiPassword
      .string()
      .min(MINIMUM_PASSWORD_SIZE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfLowercase(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfUppercase(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .minOfNumeric(ONE)
      .rule({
        message: PASSWORD_REQUIRED,
      })
      .required(),
    email: Joi.string()
      .email()
      .trim()
      .rule({
        message: EMAIL_REQUIRED,
      })
      .required(),
    phone: Joi.string()
      .trim()
      .rule({
        message: PHONE_REQUIRED,
      })
      .required(),
    dob: Joi.string()
      .trim()
      .rule({
        message: DOB_REQUIRED,
      })
      .required(),
    prevResidenceAddress: Joi.string()
      .trim()
      .rule({
        message: PREVIOUS_ADDRESS_REQUIRED,
      })
      .required(),
    kin: Joi.object({
      fullName: Joi.string()
        .trim()
        .rule({
          message: `Kin's ${FULL_NAME_REQUIRED}`,
        })
        .required(),
      email: Joi.string()
        .email()
        .trim()
        .rule({
          message: `Kin's ${EMAIL_REQUIRED}`,
        })
        .required(),
      phone: Joi.string()
        .trim()
        .rule({
          message: `Kin's ${PHONE_REQUIRED}`,
        })
        .required(),
    }),
  }),
  tenantUpdateRequestBody: Joi.object().keys({
    email: Joi.string().email().trim(),
    phone: Joi.string().trim(),
    kin: Joi.object({
      email: Joi.string().email().trim(),
      phone: Joi.string().trim(),
    }),
  }),
};

module.exports = schemas;
