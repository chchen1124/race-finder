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
const Op = require("sequelize").Op; // query operaters from sequelize

// Routes
// =============================================================
module.exports = function(app) {
	// Get all races
	app.get("/api/races/all", function(req, res) {
		DB.Race.findAll({}).then(function(results) {
			res.json(results);
		});
	});

	// Route displays landing page
	app.get("/", function(req, res) {
        res.render("index");
	});

	// Query database to return a race json
	app.post("/", function(req, res) {

		// get dates from request body (must be converted to
		// date objects to work with the Race model)
		let fromDate = new Date(req.body.startDate);
		let toDate = new Date(req.body.endDate);

		// get all races where the race date is in the
		// range of the requested dates inclusive
		DB.Race.findAll({
			include: [ DB.Location ],
			order: [["name", "ASC"]],
			where: {
				race_date: {
					[Op.gte]: fromDate,
					[Op.lte]: toDate
				}
			}			
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
