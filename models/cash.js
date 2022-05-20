const mongoose = require("./connection");

const CashSchemaStructure = {
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: mongoose.Schema.Types.ObjectId,
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

module.exports = { Cash };