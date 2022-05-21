const { Rent } = require("../models/rent");

module.exports = {
  find: (req, res) => {
    Rent.find()
      .limit(10)
      .exec((err, rents) => {
        if (err)
          return res.json({
            success: false,
            message: err,
          });

        return res.json({ rents });
      });
  },
  findOneByRentId: (req, res) => {
    Rent.findOne({ _id: req.params.Rent_id })
      .then((rent) => res.json({ rent }))
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  findOneByTenantId: (req, res) => {
    Rent.find()
      .then((rents) => {
        if (rents) {
          rents.filter((rent) => {
            if (rent.tenant === req.params.Tenant_id) return res.json({ rent });
          });
        }
        return res.json({});
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          success: false,
          message: err,
        });
      });
  },
  create: (req, res) => {
    let {
      tenant, // tenant_id
      apartment, // apartment_id
      cash, // cash_id
    } = req.body;

    Rent.create({
      tenant,
      apartment,
      cash,
    })
      .then((result) => {
        if (result)
          return res.json({
            success: true,
            message: "Rent added successfully",
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
  update: (req, res) => {
    const { email, phone } = req.body;
    const Rent_id = req.params.Rent_id;

    Rent.findOne({ _id: Rent_id }, (err, Rent) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!Rent) return res.json({ success: false, msg: "Rent no found" });

      if (email !== undefined) Rent.email = email;
      if (phone !== undefined) Rent.phone = phone;
      if (kins_email !== undefined) Rent.kins_email = kins_email;
      if (kins_phone !== undefined) Rent.kins_phone = kins_phone;

      Rent.save((err, updatedRent) => {
        if (err) {
          console.log(err);
          return res.json({ success: false, msg: err });
        }

        return res.json({
          success: true,
          msg: "Rent details updated",
          id: updatedRent._id,
        });
      });
    });
  },

  delete_: (req, res) => {
    const Rent_id = req.params.rentId;

    Rent.findOneAndRemove({ _id: Rent_id }, (err, deletedRent) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, msg: err });
      }

      if (!deletedRent)
        return res.json({ success: false, msg: "Rent no found" });

      return res.json({
        success: true,
        msg: "Rent details deleted successfully",
        id: deletedRent._id,
      });
    });
  },
};
