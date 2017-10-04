// ************************************************************
// weather.js
// 
// This module acts as a controller for the wunderground api.
// A single method is exporte--getTemps--which gets temperature 
// data from the API.
// ************************************************************

// Dependencies
const Request = require("request");

// configuration values
const apikey = "4c190f89c44f0e65";
const wgApiHost = "https://api.wunderground.com/api/";

/* 
getTemps pass an object for the min and max temp to
a callback function.

PARAMETERS:
    dateString in the format of "yyyymmdd". (8/27/2016 would 
        be "20160827")
    city and state are strings
    callback function is passed two parameters: error and data
*/
function getTemps(dateString, state, city, callback) {
    
    let arrGetParams; // array of get api params
    let queryURL; // complete wu api request url

    // wu api query parameters
    arrGetParams = [
        apikey,
        "history_" + dateString,
        "q",
        state,
        city.replace(/ /g, "_")
    ];

    // full query url
    queryURL = wgApiHost + arrGetParams.join("/") + ".json";
    console.log(queryURL);
    
    // send request to wu api
    Request(queryURL, function(error, response, body) {

        // container for min and max temps
        let temps = {};
        let arrObservations;
        
        // run the callback if an error is returned
        if(error) { return callback(error); }

        // get min, max, and calculated mean from response data
        arrObservations = JSON.parse(body).history.observations;
        temps.min = parseFloat(arrObservations[6].tempi);
        temps.max = parseFloat(arrObservations[10].tempi);
        temps.mean = ((temps.min+temps.max)/2).toFixed(1);

        // pass temps to the callback
        return callback(void 0, temps);
    });
}
module.exports = { getTemps: getTemps };
