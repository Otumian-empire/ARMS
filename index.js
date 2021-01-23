require("dotenv").config();
const express = require("express");
const cors = require("cors");

const adminRouter = require("./routes/admin");
const tenantRouter = require("./routes/tenants");

const app = express();
const port = process.env.port || 3000;

// Middlewares
app.use(express.urlencoded({ extended: false }));

// Cors
app.use(cors());

// Routes
app.use("/admin", adminRouter);
app.use("/tenants", tenantRouter);

app.listen(port, console.log(`server started on port ${port}`));

module.exports = app;
