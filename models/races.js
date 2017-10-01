// *********************************************************************************
// races.js - Container for race model.
// *********************************************************************************

// Dependencies
// =============================================================
const Sequelize = require("sequelize");
const sequelize = require("../config/connection.js");
const Locations = require("./location.js");

// Creates a "Race" model that matches up with DB
const Race = sequelize.define("races", {
	name: {
		type: Sequelize.STRING
	},
	url: {
		type: Sequelize.STRING
	},
	zip_code: {
		type: Sequelize.STRING(5),
		// zip code is the foreign key with a one to one relationship with the location model
		references: {
			model: Locations,
			key: "zip_code"
		}
	},
	date:{
		type:Sequelize.DATEONLY
	},
	avg_temp:{
		type:Sequelize.DOUBLE
	}
});
Race.sync();

// Makes the Race Model available for other files (will also create a table)
module.exports = Race;