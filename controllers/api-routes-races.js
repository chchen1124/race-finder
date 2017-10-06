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

// array and index for recursive API calls
let racesToReturn = [];
let index = 0;

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
		
		addSearchToDB(req.body);

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
					$gte: fromDate,
					$lte: toDate
				}
			}			
		}).then(function(data) {

			// return an empty object if no matching data is found
			if(data.length < 1) {
				return res.status(404).send("No matching races found.");
			}
			
			// reset array & races
			racesToReturn = [];
			index = 0;

			buildArrayOfRaces(data, function() {

				// send response with race data
				res.json(racesToReturn);
			});
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
					res.json(data.dataValues);
				});
			}
		});
	});	
};

// helper function to add current search to database
function addSearchToDB(search, res, errorHandler) {
	DB.Search.create({
		state: search.state,
		start_date: search.startDate,
		end_date: search.endDate,
		UserId: search.id
	}).catch(function (reason) {
		// if an errorHandler was passed run it
		if (errorHandler) { errorHandler(reason); }
	});
}

// buildArrayOfRaces takes in the search results array and a callback
// to execute when recursive weather calls are complete
function buildArrayOfRaces(data, callback) {
	const thumbnailPath = "assets/images/thumbs/";
	const defaultThumbFile = "";
	let thumbFile;
				
	if(index < data.length && index < 5) {
		
		// wrap db date with moment object
		let mDate = Moment(data[index].race_date, "YYYY-MM-DD");
		
		// get the thumbnail if it exists
		if (data[index].thumbnail.length > 0) {
			thumbFile = thumbnailPath + data[index].thumbnail;
		} else {
			thumbFile = defaultThumbFile;
		}
	
		racesToReturn.push({
			city: data[index].Location.city,
			state: data[index].Location.state,
			name: data[index].name,
			temp: data[index].avg_temp,
			url: data[index].url,
			date: mDate.format("M/D/YYYY"),
			thumb: thumbFile,
		});

		// if the avg_temp is null, get the temperature data
		// for the city exactly one year prior to the date of the race event
		// mDate = Moment date
		if(!racesToReturn[index].temp) {

			let dateString = mDate.subtract(1, "year").format("YYYYMMDD");

			Weather.getTemps(dateString, racesToReturn[index].state, racesToReturn[index].city, function (error, temps) {
				
				// set temp if temps was returned from API call
				if (temps) {

					racesToReturn[index].temp = temps.mean;

					// addTemp to DB
					updateDBWithRaceTemps(racesToReturn[index], function () {

						index++;
						buildArrayOfRaces(data, callback);
					});
				}

				else {

					index++;
					buildArrayOfRaces(data, callback);
				}

			});
		}

		else {

			index++;
			buildArrayOfRaces(data, callback);			
		}
	}

	else {
		callback();
	}
}

// helper function to add a temp to race record in races table
function updateDBWithRaceTemps(race, callback) {
	DB.Race.update({
		avg_temp: race.temp
	}, {
		where: {
		name: race.name
		}
	}).then(callback());
}