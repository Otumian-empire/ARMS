import cors from "cors";
import express from "express";

import httpLogger from "./config/http.logger.js";
import logger from "./config/logger.js";
import { port } from "./util/app.constant.js";

import {
  adminRoute,
  apartmentRoute,
  cashRoute,
  rentRoute,
  tenantRoute
} from "./route/index.js";

const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Http logger
app.use(httpLogger);

// Cors
app.use(cors());

// Routes
app.use("/admin", adminRoute);
app.use("/apartment", apartmentRoute);
app.use("/tenant", tenantRoute);
app.use("/cash", cashRoute);
app.use("/rent", rentRoute);

app.listen(port, logger.info(`server started on port ${port}`));

export default app;
