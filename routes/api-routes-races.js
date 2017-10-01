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
		let race = {
			name: "Test Race",
			city: "Truth and Consequences",
			state: "NM",
			date: "2018-04-01",
			temp: "18.21"
		};
		console.log("Race:", race);
		res.render("index", race);
	});
};