const adminRouter = require("express").Router();

const {
  find,
  findOne,
  create,
  login,
  update,
  delete_,
} = require("../controllers/admin.controller");

// fetch an admin
adminRouter.get("/:adminId", findOne);

adminRouter.get("/", find);

// create a admin - add admin data
adminRouter.post("/", create);

// login admin - they can change their data
adminRouter.post("/login", login);

// update - admin may update only the email
adminRouter.put("/:adminId", update);

// delete admin data - admin privileges is needed
adminRouter.delete("/:adminId", delete_);

module.exports = { adminRouter };
