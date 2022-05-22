const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const { adminRouter } = require("./routes/admin");
const { apartmentRouter } = require("./routes/apartments");
const { tenantRouter } = require("./routes/tenants");
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
app.use("/apartment", apartmentRouter);
app.use("/tenant", tenantRouter);
app.use("/cash", cashRouter);

app.listen(port, console.log(`server started on port ${port}`));

module.exports = { app };
