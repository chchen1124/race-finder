// *********************************************************************************
// CONNECTION.JS - THIS FILE INITIATES THE CONNECTION TO MYSQL
// *********************************************************************************

// Dependencies
let Sequelize = require("sequelize");

// DB Configuration Constants
const DB_USERNAME = "";
const DB_PASSWORD = "";

// Creates mySQL connection using Sequelize
let sequelize = new Sequelize("race_finder", DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Exports the connection for other files to use
module.exports = sequelize;
