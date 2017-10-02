// *********************************************************************************
// seeds.js
//
// This file contains operation to import data from csv file into the race_finder.db.
//
// To seed the race_finder db after intiializing the schema, run the following on the
// command line: "race-finder/db$ node seeds.js"
// *********************************************************************************

const FS = require("fs");
const DB = require("../models");

// seeds file name (relative path is assumed)
const SEEDS_FILE = __dirname + "/race_finder_seeds.csv"

function getObjectFromCSV(csv) {
	// split on lines to get each record
	let lines = csv.split("\n");
	
	// return an array of objects where each object
	// represents a record
	return lines.map(function(line) {
		let values = line.split(",");
		return {
			raceName: values[0],
			raceDate: values[1],
			city: values[2],
			state: values[3],
			locationId: values[4]
		};
	});
}

function addRecord(record) {
	DB.Location.create({
		city: record.city,
		state: record.state		
	}).then((data)=> {	
		DB.Race.create({
			name: record.raceName,
			race_date: record.raceDate,
			LocationId: data.id
		});
	})
}

// sync the database and start server listening
DB.sequelize.sync().then(()=>{
	FS.readFile(SEEDS_FILE, "utf8", (err, data) => {
		if (err) { throw err; }
		let records = getObjectFromCSV(data);
		
		// add records to database
		records.forEach(addRecord);
	});
});