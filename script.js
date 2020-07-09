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

    var day1 = getCityData(weatherData[5]);
    $("#date-1").text(day1.date);
    $("#temp-1").text(day1.temperature);
    $("#humidity-1").text(day1.humidity);
    $("#city-icon-1").attr("src", day1.iconURL);

    //5-day forecast

    var day2 = weatherData[13];
    var day3 = weatherData[21];
    var day4 = weatherData[29];
    var day5 = weatherData[37];

    let dateDay2 = day2.dt_txt;
    let temperatureDay2 = day2.main.temp;
    let humidityDay2 = day2.main.humidity;
    let dateDay3 = day3.dt_txt;
    let temperatureDay3 = day3.main.temp;
    let humidityDay3 = day3.main.humidity;
    let dateDay4 = day4.dt_txt;
    let temperatureDay4 = day4.main.temp;
    let humidityDay4 = day4.main.humidity;
    let dateDay5 = day5.dt_txt;
    let temperatureDay5 = day5.main.temp;
    let humidityDay5 = day5.main.humidity;

    let date2 = new Date(day2.dt_txt);
    let date3 = new Date(day3.dt_txt);
    let date4 = new Date(day4.dt_txt);
    let date5 = new Date(day5.dt_txt);

    $("#date-2").text(date2.toLocaleDateString());
    $("#temp-2").text(temperatureDay2);
    $("#humidity-2").text(humidityDay2);
    $("#date-3").text(date3.toLocaleDateString());
    $("#temp-3").text(temperatureDay3);
    $("#humidity-3").text(humidityDay3);
    $("#date-4").text(date4.toLocaleDateString());
    $("#temp-4").text(temperatureDay4);
    $("#humidity-4").text(humidityDay4);
    $("#date-5").text(date5.toLocaleDateString());
    $("#temp-5").text(temperatureDay5);
    $("#humidity-5").text(humidityDay5);

    // Get UV Index
    updateUVData(city.coord);

    // Update History
    createHistoryButtons()
}

initialize()