const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const { adminRouter } = require("./routes/admin");
const { tenantRouter } = require("./routes/tenants");
const { apartmentRouter } = require("./routes/apartments");
const { cashRouter } = require("./routes/cash");
const { port } = require("./utils/app.constant");

const app = express();
// Middleware
app.use(express.urlencoded({ extended: false }));

// Http logger
app.use(logger("dev"));

// Cors
app.use(cors());

// Routes
app.use("/admin", adminRouter);
app.use("/tenants", tenantRouter);
app.use("/apartments", apartmentRouter);
app.use("/cash", cashRouter);

app.listen(port, console.log(`server started on port ${port}`));

module.exports = { app };
