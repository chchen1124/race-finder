// *********************************************************************************
// races.js - Container for race model.
// *********************************************************************************

const Locations = require("./locations.js");

// Creates a "Race" model that matches up with DB
module.exports = function(sequelize, DataTypes) {
	const Race = sequelize.define("races", {

		// name of the race
		name: { 
			type: DataTypes.STRING ,
			allowNull: false
		},

		// url for official website or registration site
		url: { type: DataTypes.STRING },

		// zip code is a foreign key pointing to the Locations model.
		zip_code: {
			type: DataTypes.STRING(5),
			references: {
				model: Locations,
				key: "zip_code"
			}
		},

		// date of the race if available
		race_date:{ type: DataTypes.DATEONLY },

		// normal daily everage temperature historically (null if data unavailable)
		avg_temp:{ type: DataTypes.DOUBLE }
	});
	return Race;
}
