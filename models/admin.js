const mongoose = require("./connection");

const adminSchemaStructure = {
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
};

// mongoose schema
const adminSchema = new mongoose.Schema(adminSchemaStructure);

// model
const Admin = mongoose.model("admins", adminSchema);

module.exports = { Admin };
