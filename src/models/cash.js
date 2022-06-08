import mongoose from "./connection.js";

const CashSchemaStructure = {
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
};

// mongoose schema
const CashSchema = new mongoose.Schema(CashSchemaStructure);

// model
const Cash = mongoose.model("cash", CashSchema);

export default Cash;
