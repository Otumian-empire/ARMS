require("dotenv").config();

module.exports = {
  rounds: parseInt(process.env.SALT_ROUNDS, 10),
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  port: process.env.PORT || 3000,
};
