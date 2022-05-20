const mongoose = require("./connection");

const RentSchemaStructure = {
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  cashId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  rentedAt: {
    type: Date,
    default: Date.now(),
  },
};

// mongoose schema
const RentSchema = new mongoose.Schema(RentSchemaStructure);

// model
const Rent = mongoose.model("rent", RentSchema);

module.exports = { Rent };
