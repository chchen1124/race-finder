// *********************************************************************************
// locations.js - Container for location model.
// *********************************************************************************

// Dependencies
// =============================================================
const Sequelize = require("sequelize");
const sequelize = require("../config/connection.js");

// Define location model
const Location = sequelize.define("locations", {
	zip_code: {
		// uses 5 digit zip codes. use string for zips that begin with 0.
		type: Sequelize.STRING(5)
	},
	city: {
		// limit the city name length to 25 characters
		// the longest city name in the us is 22 characters (Truth or Consequences, NM)
		type: Sequelize.STRING(25)
	},
	state: {
		// use 2 character postal abreviations for states
		type: Sequelize.STRING(2)
	}
}, {
	timestamps: false
});
location.sync();

// export the Location model
module.exports = Location;