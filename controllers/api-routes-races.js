// *********************************************************************************
// api-routes-races.js - 
//
// this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
const Moment = require("moment");
const DB = require("../models");
const Request = require("request");
const Weather = require("./weather.js");

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
        res.render("index");
	});

	// Query database to return a race json
	app.post("/", function(req, res) {

		// get all races ordered by race name
		DB.Race.findAll({
			include: [ DB.Location ],
			order: [["name", "ASC"]]
		}).then(function(data) {
			let firstRace = data[0];
			let mDate = Moment(firstRace.race_date, "YYYY-MM-DD");
			let returnedRace = {
				city: firstRace.Location.city,
				state: firstRace.Location.state,
				name: firstRace.name,
				temp: firstRace.avg_temp,
				date: mDate.format("M/D/YYYY")
			};

			// get the temperature data for the city exactly
			// on year prior to the date of the race event
			mDate = mDate.subtract(1, "year");
			Weather.getTemps(
				returnedRace.city,
				returnedRace.state,
				mDate.format("YYYYMMDD"),
				function(error, temps) {
					returnedRace.temp = temps.mean;
					res.json(returnedRace);
				}
			);
		}).catch(console.log);
	});
};