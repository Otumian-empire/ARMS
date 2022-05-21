const Cash = require("../models/cash").Cash;
// const Tenant = require("../models/tenant").Tenant;

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
    const token = 123; // TODO: add a function to generate the token
    const amount = req.body.amount;

    Cash.create({ tenantId, token, amount })
      .then((result) => {
        if (result)
          return res.json({
            success: true,
            message: "Cash deposited successfully",
            id: result._id,
          });

        // throw Error("There was an error");
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  // TODO: think about whether the cash should be updated
  // update: (req, res) => {},
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
