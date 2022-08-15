import mongoose from "mongoose";

import logger from "../config/logger.js";
import { DATABASE_CONNECTED } from "../util/api.message.js";
import { MONGODB_URI } from "../util/app.constant.js";

// connect to a database, name of database after localhost/
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex: true,
});

mongoose.connection
  .once("open", function () {
    logger.info(DATABASE_CONNECTED);
  })
  .on("error ", function (error) {
    logger.error(error.message);
  });

export default mongoose;
