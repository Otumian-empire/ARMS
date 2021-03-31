require("dotenv").config();
const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const adminRouter = require("./routes/admin");
const tenantRouter = require("./routes/tenants");
const apartmentRouter = require("./routes/apartments");

const app = express();
const port = process.env.port || 3000;

// Middlewares
app.use(express.urlencoded({ extended: false }));

// Http logger
app.use(logger("dev"));

// Cors
app.use(cors());

// Routes
app.use("/admin", adminRouter);
app.use("/tenants", tenantRouter);
app.use("/apartments", apartmentRouter);

app.listen(port, console.log(`server started on port ${port}`));

module.exports = app;