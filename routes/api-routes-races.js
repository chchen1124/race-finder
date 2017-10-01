// *********************************************************************************
// api-routes-races.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var Race = require("../models/races.js");
// Routes
// =============================================================
module.exports = function(app) {
  // Get all races
  app.get("/api/all", function(req, res) {
    Race.findAll({}).then(function(results) {
      res.json(results);
    });
  });

  // Get a specific race by id
  app.get("/api/id/:id", function(req, res) {
    if (req.params.id) {
      Race.findAll({
        where: {
          id: req.params.id
        }
      }).then(function(results) {
        res.json(results);
      });
    }
  });

  // Add a race
  app.post("/api/new", function(req, res) {
    console.log("Race Info:");
    console.log(req.body);
    Race.create({
      name: req.body.name,
      url: req.body.url,
      zip_code: req.body.zip_code,
      date:req.body.date,
      avg_temp:req.body.avg_temp
    });
  });

  // Delete a race
  app.post("/api/delete", function(req, res) {
    console.log("Race Info:");
    console.log(req.body);
    Race.destroy({
      where: {
        id: req.body.id
      }
    });
  });

  // Update a race
  app.post("/api/update", function(req, res) {
    Race.update({
      name:req.body.name,
      url:req.body.url,
      zip_code: req.body.zip_code,
      date:req.body.date,
      avg_temp: req.body.avg_temp
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(results){
      res.json(results);
    });
  });
};