// Dependencies
// =============================================================

var Sequelize = require("sequelize");
var sequelize = require("../config/connection.js");

// Creates a "The_Location" model that matches up with DB
var The_Location = sequelize.define("locations", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	zip_code: {
		type: Sequelize.INTEGER
	},
	city: {
		type: Sequelize.STRING
	},
	state: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

// Syncs with DB
The_Location.sync();

// Makes the The_Location Model available for other files (will also create a table)
module.exports = The_Location;