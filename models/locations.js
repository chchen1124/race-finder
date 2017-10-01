// *********************************************************************************
// locations.js - Container for location model.
// *********************************************************************************

module.exports = function(sequelize, DataTypes) {
	// Define location model
	const Location = sequelize.define("locations", {
		// zip code is the primary key
		zip_code: {
			// uses 5 digit zip codes. use string for zips that begin with 0.
			type: DataTypes.STRING(5),
			allowNull: false,
			primaryKey: true,
			unique: true
		},
		city: {
			// limit the city name length to 25 characters
			// the longest city name in the us is 22 characters (Truth or Consequences, NM)
			type: DataTypes.STRING(25),
			allowNull: false
		},
		state: {
			// use 2 character postal abreviations for states
			type: DataTypes.STRING(2),
			allowNull: false
		}
	});
	return Location;
}