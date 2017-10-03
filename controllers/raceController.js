const db = require("../models");
const request = require("request");
const moment = require("moment");

let targetRaces = [];

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index", {});
    });

    app.post("/", function (req, res) {

        console.log(req.body);

        addSearchToDB(req.body);
        
        // wrap incoming start and end dates with moment object
        let momentStart = moment(req.body.startDate, "M/D/YYYY");
        let momentEnd = moment(req.body.endDate, "M/D/YYYY");

        // console.log(momentStart.format("M/D/YYYY"));
        // console.log(momentEnd.format("M/D/YYYY"));

        // get all races & alphabetize
        db.Race.findAll({

            order: [["race_name", "ASC"]]

        }).then(function(data) {

            console.log(data.length);
            targetRaces = [];

            for(let i = 0; i < data.length; i++) {

                let tempTargetRace = {};

                // wrap race date with moment object
                let tempMomentDate = moment(data[i].date, "M/D/YYYY");

                // find all possible matches (in date range)
                if(moment(momentStart).isSameOrBefore(tempMomentDate, "day") &&
                    moment(tempMomentDate, "M/D/YYYY").isSameOrBefore(momentEnd, "day")) {

                    tempTargetRace.name = data[i].race_name;
                    tempTargetRace.date = data[i].date;
                    tempTargetRace.state = data[i].state;
                    tempTargetRace.city = data[i].city;

                    targetRaces.push(tempTargetRace);
                }
            }

            let randomRaceIndex = Math.floor(Math.random() * targetRaces.length);

            console.log(targetRaces[randomRaceIndex]);

            let apikey = "4c190f89c44f0e65";
            let queryURL = "https://api.wunderground.com/api/" + apikey + "/history_" +
                            moment(targetRaces[randomRaceIndex].date, "M/D/YYYY").subtract(1, "year").format("YYYYMMDD") +
                            "/q/" + targetRaces[randomRaceIndex].state + "/" + targetRaces[randomRaceIndex].city.replace(/ /g, "_") + ".json";

            request(queryURL, function(error, response, body) {

                let weatherMin = JSON.parse(body).history.observations[6];
                let weatherMax = JSON.parse(body).history.observations[10];

                targetRaces[randomRaceIndex].temp = ((parseFloat(weatherMin.tempi) + parseFloat(weatherMax.tempi)) / 2).toFixed(1);

                res.json(targetRaces[randomRaceIndex]);
            });
        });
    });

    app.post("/api/login", function(req, res) {

        db.User.findAll({
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
                db.User.create({
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

function addSearchToDB(search, res) {

    console.log(search);
    db.Search.create({
        state: search.state,
        start_date: search.startDate,
        end_date: search.endDate,
        UserId: search.id
    }).then(function(data) {});
}