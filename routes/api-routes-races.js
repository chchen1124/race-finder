// *********************************************************************************
// api-routes-races.js - 
//
// this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
const DB = require("../models");

// Route Handlers
// =============================================================

// Returns an array of races based on location parameter
// Location is an object that must contain a zipCode key or
// city and state keys
function getRacesByLocation(location) {

}

// Routes
// =============================================================
module.exports = function(app) {
	// Get all races
	app.get("/api/races/all", function(req, res) {
		DB.Race.findAll({}).then(function(results) {
			res.json(results);
		});
	});

	// Displays landing page with a race from the database
	app.get("/", function(req, res) {

		// get the first race
		DB.Race.findOne({
			include: [DB.Location]
		}).then(function(result) {

			console.log("Results returned:", result);
			// let race = {
			// 	name: result,
			// 	city: result,
			// 	state: result,
			// 	date: result
			// };
			res.json(result);
			// res.render("index", );
		}).catch(function(reason) {
			console.log("Error Occurred:", reason);
			res.json(reason);
		});
	});
};