const mongoose = require("./connection");

const TenantSchemaStructure = {
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  // date of birth
  dob: {
    type: String,
    required: true,
  },
  prevResidenceAddress: {
    type: String,
    required: true,
  },
  kin: {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    residenceAddress: {
      type: String,
      required: true,
    },
  },
};

// mongoose schema
const TenantSchema = new mongoose.Schema(TenantSchemaStructure);

// model
const Tenant = mongoose.model("tenant", TenantSchema);

module.exports = { Tenant };
