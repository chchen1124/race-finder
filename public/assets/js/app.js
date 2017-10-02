const startDate = "10-01-2017";
const endDate = "9-30-2018";

let dateSlider = document.getElementById("slider-date");

$(document).ready(function () {

    // initialize Materialize select
    $("select").material_select();
    $("#results-modal").modal();
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

    $("#submit-btn").click(function() {

        if($("#state").val()) {

            let raceQuery = {};
            
            raceQuery.state = $("#state").val();
            raceQuery.startDate = $("#event-start").text();
            raceQuery.endDate = $("#event-end").text();
    
            console.log(raceQuery);
    
            $.post("/", raceQuery, function(data) {
    
                $("#match-name").text(data.name);
                $("#match-city").text(data.city);
                $("#match-state").text(data.state);
                $("#match-date").text(data.date);
                $("#match-temp").text(data.temp);
                
                $("#results-modal").modal("open");
            });
        }

        else {

            $("#validate-modal").modal("open");
        }
    });
});

function timestamp(str) {
    return new Date(str).getTime();
}

// Create a string representation of the date.
function formatDate(date) {
    return moment(date).format("M/D/YYYY");
}