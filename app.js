const express = require("express");
const cors = require("cors");

const httpLogger = require("./config/http.logger");
const logger = require("./config/logger");

const { adminRouter } = require("./routes/admin");
const { apartmentRouter } = require("./routes/apartments");
const { tenantRouter } = require("./routes/tenants");
const { cashRouter } = require("./routes/cash");
const { rentRouter } = require("./routes/rent");
const { port } = require("./utils/app.constant");

const app = express();
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Http logger
app.use(httpLogger);

// Cors
app.use(cors());

// Routes
app.use("/admin", adminRouter);
app.use("/apartment", apartmentRouter);
app.use("/tenant", tenantRouter);
app.use("/cash", cashRouter);
app.use("/rent", rentRouter);

app.listen(port, logger.info(`server started on port ${port}`));

module.exports = { app };
