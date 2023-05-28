let apiKey = "58d400590a39fd45b72b35bf872539b5";
let searchForm = $(`#searchForm`);
let newSearch = $(`#searchInput`).val();
let searchBtn = $(`#searchBtn`);
let daysBlock = $(`#daysBlock`);
let temporary = $(`#temporary`);
let recentSearches = [];
if (localStorage.getItem("recentSearches")) {
  recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
}

// check for and load recent searches from local history
// $(document).ready(writePastSearches(recentSearches));
// $(document).on('load', writePastSearches(recentSearches));

// event listener for a new search
searchBtn.on(`click`, function (event) {
  event.preventDefault();
  let citySearch = $(`#searchInput`).val();
  // call for current & future forecasts
  getForecast(citySearch);
  predictForecast(citySearch);
  saveSearch(citySearch);
  writePastSearches();
  // reset input field
  $(`#searchInput`).val("");
  temporary.addClass("hide");
  daysBlock.removeClass("hide");
});

// event listener for past searches buttons
$("#recentList").on("click", function (event) {
  let citySearch = $(event.target);
  // call for current & future forecasts from past search
  getForecast(citySearch);
  predictForecast(citySearch);
  $(`#searchInput`).val("");
  temporary.addClass("hide");
  daysBlock.removeClass("hide");
});

// function to fetch data to get & show current forecast
function getForecast(citySearch) {
  if (citySearch !== "") {
    resetForecast();
    //What is this? -> "&units=imperial&appid="
    let weatherUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      citySearch +
      "&units=imperial&appid=" +
      apiKey;
    fetch(weatherUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // show current forecast
          $(`#currentTitle`).text(data.name);
          $(`#currentIcon`).append(
            `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" class="icon" alt="${data.weather[0].description}" />`
          );
          $(`#currentDate`).text(dayjs(data.dt * 1000).format("MM/DD/YYYY"));
          $(`#currentTemperature`).text(
            "Temperature: " + data.main.temp.toFixed(0) + " °F"
          );
          $(`#currentWindSpeed`).text(
            "Wind Speed: " + data.wind.speed.toFixed(0) + " MPH"
          );
          $(`#currentHumidity`).text(
            "Humidity: " + data.main.humidity.toFixed(0) + " %"
          );
        });
      }
    });
  }
}

// function to fetch data to get and show 5 day future forecast
function predictForecast(citySearch) {
  if (citySearch !== "") {
    resetForecast();
    let futureUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      citySearch +
      "&units=imperial&appid=" +
      apiKey;
    fetch(futureUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // for loop to repeat through 5 day cycle of the following day cards
          for (i = 5; i < data.list.length; i += 8) {
            // creating elements for eah day in forecast & add classes
            let createDay = document.createElement("section");
            $(createDay).addClass("card days");
            let createForecastBasic = document.createElement("div");
            $(createForecastBasic).addClass("forecastBasic");
            let createIcon = document.createElement("div");
            $(createIcon).addClass("icon");
            let createDate = document.createElement("div");
            $(createDate).addClass("date");
            let createForecastDetail = document.createElement("div");
            $(createForecastDetail).addClass("forecastDetail");
            let createTemperature = document.createElement("div");
            $(createTemperature).addClass("stat");
            let createWindSpeed = document.createElement("div");
            $(createWindSpeed).addClass("stat");
            let createHumidity = document.createElement("div");
            $(createHumidity).addClass("stat");
            // combining the day elements through appending for each day of forecast to create a single forecast unit
            daysBlock.append(createDay);
            createDay.append(createForecastBasic);
            createForecastBasic.append(createIcon);
            createForecastBasic.append(createDate);
            createDay.append(createForecastDetail);
            createForecastDetail.append(createTemperature);
            createForecastDetail.append(createWindSpeed);
            createForecastDetail.append(createHumidity);
            // input the actual displayed information/data into the day's various elements
            $(createIcon).append(
              `<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" class="icon" alt="${data.list[i].weather[0].description}" />`
            );
            $(createDate).text(
              dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY")
            );
            $(createTemperature).text(
              `Temperature: ` + data.list[i].main.temp.toFixed(0) + ` °F`
            );
            $(createWindSpeed).text(
              `Wind Speed: ` + data.list[i].wind.speed.toFixed(0) + ` MPH`
            );
            $(createHumidity).text(
              `Humidity: ` + data.list[i].main.humidity.toFixed(0) + ` %`
            );
          }
        });
      } else {
        // alert("There seems to be an issue finding the future forecast. Please try again later.")
      }
    });
  }
}

// function to reset weather display
function resetForecast() {
  $(`#currentIcon`).empty();
  daysBlock.empty();
}

// function to save new city searches to local storage
function saveSearch(citySearch) {
  if (!recentSearches.includes(citySearch)) {
    recentSearches.push(citySearch);
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }
}

// function to write past searches from local storage
function writePastSearches() {
  $(`#recentList`).html("");
  for (let i = 0; i < recentSearches.length; i++) {
    let createBtn = document.createElement("button");
    createBtn.textContent = recentSearches[i];
    createBtn.addEventListener("click", function (e) {
      e.preventDefault();

      getForecast(e.target.textContent);
      predictForecast(e.target.textContent);
    });
    $(`#recentList`).append(createBtn);
  }
}

writePastSearches();
