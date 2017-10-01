// *********************************************************************************
// races.js - Container for race model.
// *********************************************************************************

// Creates a "Race" model that matches up with DB
module.exports = function(sequelize, DataTypes) {
	const Race = sequelize.define("Race", {

		// name of the race
		name: { 
			type: DataTypes.STRING ,
			allowNull: false
		},

		// url for official website or registration site
		url: { type: DataTypes.STRING },

		// date of the race if available
		race_date:{ type: DataTypes.DATEONLY },

		// normal daily everage temperature historically (null if data unavailable)
		avg_temp:{ type: DataTypes.DOUBLE }
	});

	// Associate the race with a location
	Race.associate = function(models) {

		// A Race can't be created without a location due to the foreign key constraint
		Race.belongsTo(models.Location, {
		  foreignKey: {
			allowNull: false
		  }
		});
	};
	return Race;
}
