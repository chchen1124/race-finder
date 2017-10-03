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

        if (loggedIn) {

            if ($("#state").val() && $("#distance").val()) {

                let raceQuery = {};

                raceQuery.state = $("#state").val();
                raceQuery.startDate = $("#event-start").text();
                raceQuery.endDate = $("#event-end").text();
                raceQuery.id = user.id;
                raceQuery.username = user.username;

                console.log(raceQuery);

                $.post("/", raceQuery, function (data) {

                    $("#match-name").text(data.name);
                    $("#match-city").text(data.city);
                    $("#match-state").text(data.state);
                    $("#match-date").text(data.date);
                    $("#match-temp").text(data.temp);

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
                
        }

        // not logged in
        else {
            $("#login-modal").modal("open");
        }

    });

    $("#login").click(function() {

        if(!loggedIn) {
            $("#login-modal").modal("open");
        }

        else {
            loggedIn = false;
            $("#user").empty();
            $("#login").text("Login");
        }
    });
});

$("#user-submit-btn").click(function() {

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