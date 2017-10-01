// *********************************************************************************
// races.js - Container for race model.
// *********************************************************************************

// Dependencies
// =============================================================
const Sequelize = require("sequelize");
const sequelize = require("../config/connection.js");

// Creates a "Race" model that matches up with DB
const Race = sequelize.define("races", {
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
Race.sync();

// Makes the Race Model available for other files (will also create a table)
module.exports = Race;