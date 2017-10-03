// ************************************************************
// weather.js
// 
// This module exports a single method: getTemps which
// gets temperature data from the weatherUnderground API.
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
    resolve is a callback which is passed an object for the min 
        and max temp for the given date and city.
    reject is a callback which is run if an error occurs
*/
function getTemps(city, state, dateString, resolve, reject) {
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
    
    // send request to wu api
    Request(queryURL, function(error, response, body) {

        // container for min and max temps
        let temps = {};
        let arrObservations;
        
        // if reject function argument is defined and an error
        // occurs, call reject
        if(error && typeof reject !== "undefined") { reject(); }

        // throw an error if no reject parameter and error occurs
        else if(error) { throw error; }

        // get min, max, and calculated mean from response data
        arrObservations = JSON.parse(body).history.observations;
        console.log(arrObservations[6]);
        temps.min = parseFloat(arrObservations[6].tempi);
        temps.max = parseFloat(arrObservations[10].tempi);
        temps.mean = ((temps.min+temps.max)/2).toFixed(1);

        // pass temps to the callback
        resolve(temps);
    });
}
module.exports = { getTemps: getTemps };

// TEST CODE
// ===================================================================
// its up to the controller to format the parameters as needed
// getTemps(
//     "Bakersfield", "CA", "20160827",
//     console.log,
//     console.log
// );