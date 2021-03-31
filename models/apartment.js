const mongoose = require("./connection");

// TODO: add images of the room
const apartmentSchemaStructure = {
  room_number: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  fee: {
    type: Number,
    required: true,
  },
};

// mongoose schema
const apartmentSchema = new mongoose.Schema(apartmentSchemaStructure);

// model
const Apartment = mongoose.model("apartments", apartmentSchema);

module.exports = Apartment;