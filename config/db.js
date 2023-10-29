const mongoose = require("mongoose");
const config = require("./app-config");

mongoose.connect(config.DBURL).then(() => console.log("DB Connection Completed")).catch(error => console.log(error, "DB Connection Failed"));

module.exports = mongoose;