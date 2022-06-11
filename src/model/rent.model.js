import mongoose from "./connection.js";

const RentSchemaStructure = {
  // TODO: think about whether a use can rent multiple rooms
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  cashId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  rentedAt: {
    type: Date,
    default: Date.now()
  }
};

// mongoose schema
const RentSchema = new mongoose.Schema(RentSchemaStructure);

// model
const RentModel = mongoose.model("rent", RentSchema);

export default RentModel;
