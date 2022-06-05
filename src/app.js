import cors from "cors";
import express from "express";


import httpLogger from "./config/http.logger.js";
import logger from "./config/logger.js";
import { port } from "./utils/app.constant.js";

import { adminRouter } from "./routes/admin.js";
import { apartmentRouter } from "./routes/apartments.js";
import { cashRouter } from "./routes/cash.js";
import { rentRouter } from "./routes/rent.js";
import { tenantRouter } from "./routes/tenants.js";

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

export { app };
