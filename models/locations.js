// *********************************************************************************
// locations.js - Container for location model.
// *********************************************************************************

module.exports = function(sequelize, DataTypes) {
	
	// Define location model
	const Location = sequelize.define("Location", {

		// zip code is the primary key. string containing a 5 digit zip code.
		// use a string because zip codes are not used on math operations and
		// string maintains leading zeroes.
		zip_code: {
			type: DataTypes.STRING(5),
			unique: true
		},


		// limit the city name length to 25 characters
		// the longest city name in the us is 22 characters (Truth or Consequences, NM)
		city: {
			type: DataTypes.STRING(25),
			allowNull: false
		},

		// 2 character postal abrevation for the state
		state: {
			type: DataTypes.STRING(2),
			allowNull: false
		}
	});

	Location.associate = function(models) {

		// When a location is deleted all races associated with the
		// location are deleted
		Location.hasMany(models.Race, {
		  onDelete: "cascade"
		});
	  };

	return Location;
}