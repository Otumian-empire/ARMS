const mongoose = require("./connection");

const ApartmentSchemaStructure = {
  roomNumber: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
};

// mongoose schema
const ApartmentSchema = new mongoose.Schema(ApartmentSchemaStructure);

// model
const Apartment = mongoose.model("apartment", ApartmentSchema);

module.exports = { Apartment };
