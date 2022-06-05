import mongoose from "./connection.js";

const ApartmentSchemaStructure = {
  roomNumber: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
};

// mongoose schema
const ApartmentSchema = new mongoose.Schema(ApartmentSchemaStructure);

// model
const Apartment = mongoose.model("apartment", ApartmentSchema);

export { Apartment };
