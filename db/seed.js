// ***************************************************************************
// seeds.js
//
// Run this script to seed the race_finder db.
//
// To seed the race_finder db after intiializing the schema, run the following:
// "...race-finder/db$ node seeds.js".
// ***************************************************************************

const FS = require("fs");
const DB = require("../models");

// fully qualified file name for the seeds csv.
const SEEDS_FILE = `${__dirname}/race_finder_seeds.csv`;

// Returns array of objects for each record in string of csv.
// csv must contain one record per line (utf8).
// Example line: "Race Name, Date, City, State, LocationId/n"
function getObjectFromCSV(csv) {
    // split on lines to get each record
    const lines = csv.split("\n");

    // return an array of objects where each object
    // represents a record
    return lines.map((line) => {
        const values = line.split(",");
        return {
            raceName: values[0],
            raceDate: values[1],
            url: values[5],
            city: values[2],
            state: values[3],
            locationId: values[4],
            thumbnail: values[6],
        };
    });
}

// Adds a new record to the Location and Race
// database from a record object returned in the
// array returned by getObjectFromCSV.
function addRecord(record) {
    DB.Location.create({
        city: record.city,
        state: record.state,
    }).then((data) => {
        DB.Race.create({
            name: record.raceName,
            race_date: record.raceDate,
            url: record.url,
            LocationId: data.id,
            thumbnail: record.thumbnail,
        });
    });
}

// sync the database and seed it from SEED_FILE
DB.sequelize.sync().then(() => {
    FS.readFile(SEEDS_FILE, "utf8", (err, data) => {
        if (err) { throw err; }
        const records = getObjectFromCSV(data);

        // add records to database
        records.forEach(addRecord);
    });
});
