// Dependencies
// =============================================================

// Sequelize (capital) references the standard library
var Sequelize = require("sequelize");
// sequelize (lowercase) references my connection to the DB.
var sequelize = require("../config/connection.js");

// Creates a "Race" model that matches up with DB
var Race = sequelize.define("races", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  zip_code: {
    type: Sequelize.INTEGER
  },
  date:{
    type:Sequelize.DATEONLY
  },
  avg_temp:{
    type:Sequelize.DOUBLE
  }
}, {
  timestamps: false
});

// Syncs with DB
Race.sync();

// Makes the Race Model available for other files (will also create a table)
module.exports = Race;