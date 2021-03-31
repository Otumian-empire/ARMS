const mongoose = require("./connection");

const tenantSchemaStructure = {
  full_name: {
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
  date_of_birth: {
    type: String,
    required: true,
  },
  address_of_previous_residence: {
    type: String,
    required: true,
  },
  kins_full_name: {
    type: String,
    required: true,
  },
  kins_email: {
    type: String,
    required: true,
  },
  kins_phone: {
    type: String,
    required: true,
  },
  kins_residence_address: {
    type: String,
    required: true,
  },
};

// mongoose schema
const tenantSchema = new mongoose.Schema(tenantSchemaStructure);

// model
const Tenant = mongoose.model("tenants", tenantSchema);

module.exports = { Tenant };
