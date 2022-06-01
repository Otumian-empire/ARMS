require("dotenv").config();

const mongoose = require("mongoose");

const logger = require("../config/logger");
const {
  DATABASE_CONNECTED,
  DATABASE_NOT_CONNECTED,
} = require("../utils/api.messages");

// connect to a database, name of database after localhost/
mongoose.connect(process.env.MONGODB_URI, {
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

module.exports = mongoose;
