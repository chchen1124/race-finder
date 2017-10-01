const db = require("../models");
const request = require("request");
const moment = require("moment");

module.exports = function (app) {

    app.get("/", function (req, res) {

        db.Race.findAll({
            order: [["race_name", "ASC"]]
        }).then(function(data) {

            let randomRace = Math.floor(Math.random() * data.length);
    
            let apikey = "4c190f89c44f0e65";
            let queryURL = "https://api.wunderground.com/api/" + apikey + "/history_" +
                            moment(data[randomRace].date, "MM/DD/YYYY").subtract(1, "year").format("YYYYMMDD") +
                            "/q/" + data[randomRace].state + "/" + data[randomRace].city.replace(/ /g, "_") + ".json";

            request(queryURL, function(error, response, body) {
              
                let targetRace = {};
                
                targetRace.name = data[randomRace].race_name;
                targetRace.date = data[randomRace].date;
                targetRace.state = data[randomRace].state;
                targetRace.city = data[randomRace].city;
                
                let weatherMin = JSON.parse(body).history.observations[6];
                let weatherMax = JSON.parse(body).history.observations[10];

                targetRace.temp = (parseFloat(weatherMin.tempi) + parseFloat(weatherMax.tempi)) / 2;

                res.render("index", {race: targetRace});
            });
        });
    });

    app.post("/", function (req, res) {

        // if (req.body.race === "") {
        //     res.redirect("/");
        // }

        // else {

            // db.Burger.create({
            //     burger_name: req.body.burger
            // }).then(function(data) {

                res.redirect("/");
            // });
        // }
    });

    app.put("/:id", function (req, res) {

        // db.Burger.update({
        //     devoured: true
        // }, {
        //     where: {
        //         id: req.params.id
        //     }
        // }).then(function (data) {
        //     res.redirect("/");
        // });
    });
};