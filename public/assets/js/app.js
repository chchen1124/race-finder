const startDate = "10-01-2017";
const endDate = "9-30-2018";

let dateSlider = document.getElementById("slider-date");

let loggedIn = false;
let user = {};

$(document).ready(function () {

    // initialize Materialize components
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

    // listen for search button 
    $("#race-submit-btn").click(function (event) {

        event.preventDefault();

        if ($("#location-btn").text().trim() === "CA" && $("#distance-btn").text().trim() === "Marathon") {

            let raceQuery = {};

            $("#carousel").hide();
            $("#running-man").show();

            raceQuery.state = "CA";
            raceQuery.startDate = $("#event-start").text();
            raceQuery.endDate = $("#event-end").text();
            raceQuery.id = user.id;
            raceQuery.username = user.username;

            setTimeout(function () {

                $.post("/", raceQuery, function (data) {

                    $("#carousel").empty();
                    $(".carousel").carousel("destroy");
                    loadCarousel(data);
                    $("#running-man").hide();
                    $("#carousel").show();
                    $(".carousel").carousel();
                    // $(".carousel").carousel("set", 0);
                }).fail(function () {

                    $("#races-container").html("There are no races for your search");
                    $("#running-man").hide();
                    $("#results-modal").modal("open");
                    $("#carousel").show();
                });
            }, 1000);
        }

        else {

            if ($("#location-btn").text().trim() !== "CA") {

                $("#validate-error-message").text("Please select a state");
                $("#validate-modal").modal("open");
            }

            else {

                $("#validate-error-message").text("Please select a race distance");
                $("#validate-modal").modal("open");
            }
        }

    });

    // listen for login link
    $("#login").click(function () {

        if (!loggedIn) {
            $("#login-modal").modal("open");
            // $("#race-submit-button").addClass("scale-in");
        }

        else {
            loggedIn = false;
            $("#user").empty();
            $("#login").text("Login");
            user = {};
        }
    });
});

// load the carousel with new search results
// receives an array of races
function loadCarousel(races) {


//    <div id="carousel" class="carousel">
    let carousel = $("<div>");
    carousel.addClass("carousel");
    carousel.attr("id", "carousel");

    // loop through all races returned from query, add to carousel
    for (let i = 0; i < races.length; i++) {

        addCarouselItem(races[i], i);
    }
}

// adds one carousel item to the carousel
function addCarouselItem(race, index) {

    // build the Carousel Item and append to carousel
    let newCarouselItem = $("<a>");
    newCarouselItem.addClass("carousel-item");
    newCarouselItem.attr({
        "id": "carousel-item-" + index,
        "href": race.url,
        "target": "_blank"
    });
    $("#carousel").append(newCarouselItem);

    // add the card
    let newCard = $("<div>");
    newCard.addClass("card");
    newCarouselItem.append(newCard);

    // add the image container
    let newCardImageContainer = $("<div>");
    newCardImageContainer.addClass("card-image");
    newCard.append(newCardImageContainer);

    // img
    let newCardImg = $("<img>");
    newCardImg.attr({
        "id": "card-img-" + index,
        "src": race.thumb
    });

    // title
    let newCardTitle = $("<span>");
    newCardTitle.addClass("card-title");
    newCardTitle.attr("id", "card-title" + index);
    newCardTitle.text(race.name);

    // add img and title to the container
    newCardImageContainer.append(newCardImg, newCardTitle);

    // add the carousel dialog
    let newCarouselDialog = $("<div>");
    newCarouselDialog.addClass("carousel-dialog");
    newCarouselDialog.attr("id", "carousel-dialog-" + index);
    newCarouselItem.append(newCarouselDialog);

    let newCarouselDialogDate = $("<p>");
    newCarouselDialogDate.addClass("carousel-dialog-date");
    newCarouselDialogDate.text(race.date);

    let newCarouselDialogCityState = $("<p>");
    newCarouselDialogCityState.addClass("carousel-dialog-city-state");
    newCarouselDialogCityState.text(race.city + ", " + race.state);
    
    let newCarouselDialogTemp = $("<p>");
    newCarouselDialogTemp.addClass("carousel-dialog-temp");
    newCarouselDialogTemp.html(race.temp + "&deg;");

    // append the race info to the new carousel dialog
    newCarouselDialog.append(newCarouselDialogDate, newCarouselDialogCityState, newCarouselDialogTemp);
}

$("#user-submit-btn").click(function (event) {

    event.preventDefault();

    let newUser = {};

    if ($("#user-name").val().trim()) {

        newUser.username = $("#user-name").val().trim();
        $("#user-name").val("");
        $("#login-dialog").modal("close");

        $.post("api/login", newUser, function (data) {

            console.log(data);

            // on success
            if (data) {
                user = newUser;
                user.id = data.id;
                loggedIn = true;
                $("#user").text(user.username);
                $("#login").html("&nbsp;| Logout");
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
    $("#distance-btn").html(" &nbsp;&nbsp; Marathon &nbsp;&nbsp; ");
});

// click listener for CA drop-down option
// changes text on button to "CA"
$("#CA").click(function () {
    $("#location-btn").html(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ");
});

$(document).on("mouseenter", ".carousel-item", function() {

    $(this).find(".carousel-dialog").show();
});

$(document).on("mouseleave", ".carousel-item", function() {

    $(this).find(".carousel-dialog").hide();
})