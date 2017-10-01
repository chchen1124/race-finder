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

		// get race and location info for the first race in the db
		DB.Race.findAll({ include: [DB.Location] }).then(function(results) {
			let firstRace = results[0];
			let race = {
				name: firstRace.name,
				date: firstRace.race_date,
				temp: firstRace.avg_temp,
				url: firstRace.url,
				city: firstRace.Location.city,
				state: firstRace.Location.state,
				zip_code: firstRace.Location.zip_code
			};
			res.render("index", { race: race });
		}).catch(console.log);
	});
};