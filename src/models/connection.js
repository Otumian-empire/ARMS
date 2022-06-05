import mongoose from "mongoose";

import logger from "../config/logger.js";
import {
  DATABASE_CONNECTED,
  DATABASE_NOT_CONNECTED,
} from "../utils/api.messages.js";
import { MONGODB_URI } from "../utils/app.constant.js";

// connect to a database, name of database after localhost/
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

mongoose.connection
  .once("open", function () {
    logger.info(DATABASE_CONNECTED);
  })
  .on("error ", function (error) {
    logger.info(DATABASE_NOT_CONNECTED);
    logger.error(error);
  });

export default mongoose;
