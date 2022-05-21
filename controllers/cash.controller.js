const Cash = require("../models/cash").Cash;
const { generateToken } = require("../utils/functions");

module.exports = {
  find: (req, res) => {
    Cash.find()
      .limit(10)
      .exec((err, cashes) => {
        if (err)
          return res.json({
            success: false,
            message: err,
          });

        return res.json({ cashes });
      });
  },
  findOne: (req, res) => {
    Cash.findOne({ _id: req.params.tenantId })
      .then((cash) => res.json({ cash }))
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  create: (req, res) => {
    const tenantId = req.params.tenantId;
    const token = generateToken();
    const amount = req.body.amount;

    Cash.create({ tenantId, token, amount })
      .then((result) => {
        if (result)
          return res.json({
            success: true,
            message: "Cash deposited successfully",
            id: result._id,
          });
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  delete_: (req, res) => {
    Cash.findOneAndRemove({ _id: req.params.cashId }, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!result) return res.json({ success: false, msg: "tenant no found" });

      return res.json({
        success: true,
        msg: "Cash details deleted successfully",
        id: result._id,
      });
    });
  },
};
