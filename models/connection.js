const mongoose = require("mongoose");

// connect to a database, name of database after localhost/
mongoose.connect("mongodb://127.0.0.1/arms_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// very connection
mongoose.connection
  .once("open", function () {
    console.log("Database connected successfully");
  })
  .on("error ", function (err) {
    console.log("Database not connected successfully");
    console.log(err);
  });

module.exports = mongoose;
