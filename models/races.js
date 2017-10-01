// *********************************************************************************
// races.js - Container for race model.
// *********************************************************************************

const Locations = require("./locations.js");

// Creates a "Race" model that matches up with DB
module.exports = function(sequelize, DataTypes) {
	const Race = sequelize.define("races", {
		name: {
			type: DataTypes.STRING
		},
		url: {
			type: DataTypes.STRING
		},
		zip_code: {
			type: DataTypes.STRING(5),
			// zip code is the foreign key with a one to one relationship with the location model
			references: {
				model: Locations,
				key: "zip_code"
			}
		},
		race_date:{
			type:DataTypes.DATEONLY
		},
		avg_temp:{
			type:DataTypes.DOUBLE
		}
	});
	return Race;
}
