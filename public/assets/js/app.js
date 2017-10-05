const startDate = "10-01-2017";
const endDate = "9-30-2018";

let dateSlider = document.getElementById("slider-date");

let loggedIn = false;
let user = "";
let imageFilenames = ["ave-giants.jpg", "bakersfield.jpg", "big-sur.jpg", "bizz-johnson.jpg", "cim.jpg"];

$(document).ready(function () {

    // initialize Materialize components
    $("#results-modal").modal();
    $("#login-modal").modal();
    $("#validate-modal").modal();
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

        // if (loggedIn) {

            if($("#location-btn").text() === "CA" && $("#distance-btn").text() === "Marathon") { 

                let raceQuery = {};

                $("#carousel").hide();
                $("#running-man").show();

                raceQuery.state = "CA";
                raceQuery.startDate = $("#event-start").text();
                raceQuery.endDate = $("#event-end").text();
                raceQuery.id = user.id;
                raceQuery.username = user.username;

                setTimeout(function() {

                    $.post("/", raceQuery, function (data) {
                        
                        console.log(data);
    
                        $("#results-header").text("Your Races (" + data.length + ")");
                        $("#races-container").empty();
    
                        // loop through all races received and add to html
                        for(let i = 0; i < data.length; i++) {

                            // create the front of the card
                            let cardFront = $("<div>");
                            cardFront.addClass("front");

                            let cardCard = $("<div>");
                            cardCard.addClass("card");

                            cardFront.append(cardCard);

                            cardImgDiv = $("<div>");
                            cardImgDiv.addClass("card-image");

                            cardCard.append(cardImgDiv);

                            let cardImg = $("<img>");
                            cardImg.addClass("results-img");
                            cardImg.attr("src", "assets/images/thumbs/" + imageFilenames[i]);
                            cardImgDiv.append(cardImg);

                            let cardSpan = $("<span>");
                            cardSpan.addClass("card-title");
                            cardSpan.text(data[i].name);

                            cardImgDiv.append(cardImg, cardSpan);

                            // create the back of the card
                            let cardBack = $("<div>");
                            cardBack.addClass("back");

                            // let raceNameP = $("<p>");
                            // raceNameP.html("<b>" + data[i].name + "</b>");
                            
                            let raceCityStateP = $("<p>");
                            raceCityStateP.text(data[i].city + ", " + data[i].state);
    
                            let raceDateP = $("<p>");
                            raceDateP.text(data[i].date);
    
                            let raceTempP = $("<p>");
                            raceTempP.html(data[i].temp + "&deg;");
    
                            let raceURLP = $("<p>");
    
                            // if(data[i].url) {
    
                            //     let raceURLA = $("<a>");
                            //     raceURLA.text(data[i].url);
                            //     raceURLA.attr({ "href": data[i].url, "target": "_blank" });
                            //     raceURLP.append(raceURLA);
                            // }
                            
                            // else {
                            //     raceURLP.text("Website URL Unavailable");
                            // }
    
                            cardBack.append(raceCityStateP, raceDateP, raceTempP);

                            resultsCard = $("<div>");
                            resultsCard.addClass("results-card");
                            resultsCard.append(cardFront, cardBack);

                            resultsLink = $("<a>");
                            resultsLink.attr({ "href": data[i].url, "target": "_blank" });

                            resultsLink.append(resultsCard);

                            $("#races-container").append(resultsLink);
                            $("#results-modal").modal("open");
                        }

                        $("#running-man").hide();
                        $("#carousel").show();
    
                    }).fail(function() {
    
                        $("#races-container").html("There are no races for your search");
                        $("#results-modal").modal("open");
                    });
                }, 1000);
            }

            else {

                if ($("#location-btn").text() !== "CA" ) {

                    $("#validate-error-message").text("Please select a state");
                    $("#validate-modal").modal("open");
                }

                else {

                    $("#validate-error-message").text("Please select a race distance");
                    $("#validate-modal").modal("open");
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

// helper function for date slider
function timestamp(str) {
    return new Date(str).getTime();
}

// Create a string representation of the date.
function formatDate(date) {
    return moment(date).format("M/D/YYYY");
}

// click listener for Marathon drop-down button
// changes text on button to "Marathon"
$("#marathon").click(function () {

    $("#distance-btn").text("Marathon");
    $("#distance-btn").toggleClass('active');
});

// click listener for CA drop-down option
// changes text on button to "CA"
$("#CA").click(function () {

    $("#location-btn").text("CA")
    $("#location-btn").toggleClass('focus');
});

$.initialize(".results-card", function() {
	$(".results-card").flip({
        axis: 'y',
        trigger: 'hover'
});