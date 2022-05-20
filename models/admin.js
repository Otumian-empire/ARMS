const mongoose = require("./connection");

const AdminSchemaStructure = {
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
const AdminSchema = new mongoose.Schema(AdminSchemaStructure);

// model
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Admin };
