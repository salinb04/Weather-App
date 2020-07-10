var apiKey = "1a2ff98ae08eda13c9094542246a6eba"
var baseURL = "http://api.openweathermap.org/data/2.5/"
// var url = "q=Dallas&APPID=1a2ff98ae08eda13c9094542246a6eba"

// History of Cities
var cities = ["El Paso", "Houston"]

// onclick
$("#search-button").click((event) => {
    event.preventDefault();

    // TODO: TitleCase vs LowerCase
    var city = $("#search-bar").val().trim();

    if (city !== "") {
        searchCity(city);
    }
})

function initialize() {
    searchCity(cities[cities.length - 1])
}

function searchCity(city) {
    // Add new city to history
    if (!cities.includes(city)) {
        cities.push(city);
    }

    // Call for forecast
    var url = `${baseURL}forecast?q=${city}&appid=${apiKey}&units=imperial`

    // Async
    $.get(url, (data, status) => {
        updateData(data);
    })
};

function createHistoryButtons() {
    $("#history-list").empty();

    for (var i = 0; i < cities.length; i++) {
        // Then dynamically generating history buttons for each city in the array
        // This code $("<li>") is all jQuery needs to create the beginning and end tag. (<li></li>)
        var a = $("<li>");
        // Adding a class of list-group-item to our button
        a.addClass("list-group-item");
        // Adding a data-attribute
        a.attr("data-name", cities[i]);
        // Providing the initial button text
        a.text(cities[i]);
        // Adding the button to the list-group div
        $("#history-list").append(a);

        a.click((event) => {
            searchCity(event.currentTarget.dataset.name)
        })
    };
};


function updateUVData(coordinates) {
    var {
        lat,
        lon
    } = coordinates;

    var url = `${baseURL}uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`

    $.get(url, (data, status) => {
        $("#uv").text(data.value);
    })
}

function getCityData(today) {
    let temperature = today.main.temp;
    let humidity = today.main.humidity;
    let windSpeed = today.wind.speed;
    let date = (new Date(today.dt_txt)).toLocaleDateString();
    let iconID = today.weather[0].icon;
    let iconURL = `http://openweathermap.org/img/wn/${iconID}@2x.png`

    return {
        temperature,
        humidity,
        windSpeed,
        date,
        iconURL
    }
}

function updateData(data) {
    var weatherData = data.list;
    var city = data.city;

    // Todays Weather
    var today = weatherData[0];
    var w = getCityData(today);

    $("#city").text(city.name);
    $("#temp").text(w.temperature);
    $("#humidity").text(w.humidity);
    $("#wind-speed").text(w.windSpeed);
    $("#date-label").text(w.date);
    $("#city-icon").attr("src", w.iconURL);

    //5-day forecast

    var day1 = getCityData(weatherData[9]);
    $("#date-1").text(day1.date);
    $("#temp-1").text(day1.temperature);
    $("#humidity-1").text(day1.humidity);
    $("#city-icon-1").attr("src", day1.iconURL);

    var day2 = getCityData(weatherData[17]);
    $("#date-2").text(day2.date);
    $("#temp-2").text(day2.temperature);
    $("#humidity-2").text(day2.humidity);
    $("#city-icon-2").attr("src", day2.iconURL);

    var day3 = getCityData(weatherData[25]);
    $("#date-3").text(day3.date);
    $("#temp-3").text(day3.temperature);
    $("#humidity-3").text(day3.humidity);
    $("#city-icon-3").attr("src", day3.iconURL);

    var day4 = getCityData(weatherData[33]);
    $("#date-4").text(day4.date);
    $("#temp-4").text(day4.temperature);
    $("#humidity-4").text(day4.humidity);
    $("#city-icon-4").attr("src", day4.iconURL);

    var day5 = getCityData(weatherData[39]);
    $("#date-5").text(day5.date);
    $("#temp-5").text(day5.temperature);
    $("#humidity-5").text(day5.humidity);
    $("#city-icon-5").attr("src", day5.iconURL);

    let date1 = new Date(day1.dt_txt);
    let date2 = new Date(day2.dt_txt);
    let date3 = new Date(day3.dt_txt);
    let date4 = new Date(day4.dt_txt);
    let date5 = new Date(day5.dt_txt);

    // Get UV Index
    updateUVData(city.coord);

    // Update History
    createHistoryButtons()
}

initialize()