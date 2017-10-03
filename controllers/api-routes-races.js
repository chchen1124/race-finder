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

		// get state from the request body. defaults to "CA" if
		// the state is not set
		let state = req.body.state || "CA";

		// get all races where the race date is in the
		// range of the requested dates inclusive
		DB.Race.findAll({
			include: [{
				model: DB.Location,
				where: { state: state }
			}],
			order: [["name", "ASC"]],
			where: {
				race_date: {
					[Op.gte]: fromDate,
					[Op.lte]: toDate
				}
			}			
		}).then(function(data) {
			// return an empty object if not matching data
			// is found
			if(data.length < 1) {
				return res.status(404).send("No matching races found.");
			}

			// get the first race from the returned array
			// of races
			let firstRace = data[0];
			let mDate = Moment(firstRace.race_date, "YYYY-MM-DD");
			let returnedRace = {
				city: firstRace.Location.city,
				state: firstRace.Location.state,
				name: firstRace.name,
				temp: null,
				url: firstRace.url,
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

					// set temp if temps was returned
					if(temps) {
						returnedRace.temp = temps.mean;
					}

					// send response with race data
					res.json(returnedRace);
				}
			);
		}).catch(console.log);
	});

	// Check if user exists.  If not, create new user
	// Returns an object with user info
    app.post("/api/login", function(req, res) {
		
		DB.User.findAll({
			where: {
				username: req.body.username
			}
		}).then(function(data) {

			// user exists in db
			if(data.length > 0) {
				res.json(data[0]);
			}

			// create new user
			else {
				DB.User.create({
					username: req.body.username,
					password: "1234"
				}).then(function(data) {

					console.log(data.dataValues);
					res.json(data.dataValues);
				});
			}
		});
	});	
};
