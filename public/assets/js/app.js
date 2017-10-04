const startDate = "10-01-2017";
const endDate = "9-30-2018";

let dateSlider = document.getElementById("slider-date");

let loggedIn = false;
let user = "";

$(document).ready(function () {

    // initialize Materialize components
    $("select").material_select();
    $("#results-modal").modal();
    $("#login-modal").modal();
    $("#validate-modal-state").modal();
    $("#validate-modal-distance").modal();
    $(".carousel").carousel();
    $('.carousel.carousel-slider').carousel({fullWidth: true});

    // build date slider (from noUISlider)
    noUiSlider.create(dateSlider, {
        // Create two timestamps to define a range.
        range: {
            min: timestamp(startDate),
            max: timestamp(endDate)
        },

        // Steps of one week
        step: 7 * 24 * 60 * 60 * 1000,

        // Two more timestamps indicate the handle starting positions.
        start: [timestamp(startDate), timestamp(endDate)],

        // No decimals
        format: wNumb({
            decimals: 0
        })
    });

    let dateValues = [
        document.getElementById('event-start'),
        document.getElementById('event-end')
    ];

    dateSlider.noUiSlider.on('update', function (values, handle) {
        dateValues[handle].innerHTML = formatDate(new Date(+values[handle]));
    });

    // race search submit button listener 
    $("#race-submit-btn").click(function(event) {

        event.preventDefault();

        // if (loggedIn) {

            if ($("#state").val() && $("#distance").val()) {

                let raceQuery = {};

                raceQuery.state = $("#state").val();
                raceQuery.startDate = $("#event-start").text();
                raceQuery.endDate = $("#event-end").text();
                raceQuery.id = user.id;
                raceQuery.username = user.username;

                console.log(raceQuery);

                $.post("/", raceQuery, function (data) {

                    console.log(data);

                    // loop through all races received and add to html
                    for(let i = 0; i < data.length; i++) {

                        let raceNameP = $("<p>");
                        raceNameP.text(data[i].name);
                        
                        let raceCityP = $("<p>");
                        raceCityP.text(data[i].city);

                        let raceStateP = $("<p>");
                        raceStateP.text(data[i].state);

                        let raceDateP = $("<p>");
                        raceDateP.text(data[i].date);

                        let raceTempP = $("<p>");
                        raceTempP.text(data[i].temp);

                        let raceURLP = $("<p>");
                        let raceURLA = $("<a>");
                        raceURLA.text(data[i].url);
                        raceURLA.attr({
                            "href": data[i].url,
                            "target": "_blank"
                        });
                        raceURLP.append(raceURLA);

                        let raceDiv = $("<div>");
                        raceDiv.append( raceNameP, raceCityP, raceStateP, raceDateP, raceTempP, raceURLP);

                        $("#races-container").append(raceDiv);
                    }

                    $("#results-modal").modal("open");
                });
            }

            else {

                if (!$("#state").val()) {

                    $("#validate-modal-state").modal("open");
                }

                else {

                    $("#validate-modal-distance").modal("open");
                }
            }
                
        // }

        // not logged in
        // else {
        //     $("#login-modal").modal("open");
        // }

    });

    $("#login").click(function() {

        if(!loggedIn) {
            $("#login-modal").modal("open");
            $("#race-submit-button").addClass("scale-in");   
        }

        else {
            loggedIn = false;
            $("#user").empty();
            $("#login").text("Login");
        }
    });
});

$("#user-submit-btn").click(function(event) {

    event.preventDefault();

    let newUser = {};

    if($("#user-name").val().trim()) {

        newUser.username = $("#user-name").val().trim();
        $("#user-name").val("");
        $("#login-modal").modal("close");

        $.post("api/login", newUser, function (data) {

            console.log(data);

            // on success
            if (data) {
                user = newUser;
                user.id = data.id;
                loggedIn = true;
                $("#user").text(user.username);
                $("#login").text(" | Logout");
            }
        });
    }
});

function timestamp(str) {
    return new Date(str).getTime();
}

// Create a string representation of the date.
function formatDate(date) {
    return moment(date).format("M/D/YYYY");
}