let apiKey = "ff0fe0ffb9358980f404ff0571afd9d3";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

let formElement = document.querySelector("form");
let inputCityElement = document.querySelector(".form-control");
let cityElement = document.getElementById("city");
let dateTodayElement = document.getElementById("date-today");
let descriptionElement = document.getElementById("description");
let humidityElement = document.getElementById("humidity");
let windElement = document.getElementById("wind");
let iconTodayElement = document.getElementById("icon-today");
let temperatureTodayElement = document.getElementById("temperature-today");
let celsiusElement = document.getElementById("celsius");
let fahrenheitElement = document.getElementById("fahrenheit");
 let forecastElement = document.getElementById("forecast");
let celsiuseTemperature = null;
let city = "Mashhad";
search(city);

formElement.addEventListener("submit", handelSubmit);
fahrenheitElement.addEventListener("click", displayFahrenhite);
celsiusElement.addEventListener("click", displayCelsiuse);

function handelSubmit(e) {
  e.preventDefault();
  let city = inputCityElement.value;
  search(city);
}

function search(city) {
  let link = `${apiUrl}${city}&appid=${apiKey}&units=metric`;
  console.log(link);
  forecastElement.innerHTML = ""
  axios.get(link).then(displayTemperature);
}
function displayTemperature(response) {
  console.log(response.data.name);
  cityElement.innerHTML = response.data.name;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;

  descriptionElement.innerHTML = response.data.weather[0].description;

  iconTodayElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconTodayElement.setAttribute("alt", response.data.weather[0].description);
  descriptionElement.innerHTML = response.data.weather[0].description;
  temperatureTodayElement.innerHTML = Math.round(response.data.main.temp);
  celsiuseTemperature = Math.round(response.data.main.temp);
  celsiusElement.classList.add("active");
  windElement.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  dateTodayElement.innerHTML = formatDate(response.data.dt * 1000);
  getForecastData(response.data.coord);
}

function formatDate(dt) {
  let date = new Date(dt);
  let hours = date.getHours(dt);
  let minutes = date.getMinutes(dt);
  let day = date.getDay(dt);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednsday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return `${days[day]} ${hours}:${minutes}`;
}

function displayCelsiuse(e) {
  e.preventDefault();
  temperatureTodayElement.innerHTML = celsiuseTemperature;
  celsiusElement.classList.add("active");
  fahrenheitElement.classList.remove("active");
}
function displayFahrenhite(e) {
  e.preventDefault();
  let fahrenheit = Math.round((celsiuseTemperature * 9) / 5 + 32);
  temperatureTodayElement.innerHTML = fahrenheit;
  fahrenheitElement.classList.add("active");
  celsiusElement.classList.remove("active");
}
function displayForecast(response) {
 
  let dailyForecast = response.data.daily.slice(0,5);
  console.log(dailyForecast);

  dailyForecast.forEach(function (dayForecast) {
   
  
    forecastElement.innerHTML += `<div class="col">
    
      <div class="WeatherForecastPreview">
        <div class="forecast-time">${formatDateForecast(
          dayForecast.dt * 1000
        )}</div>
          <span class="weather-icon-forecast">
            <img
                  src="http://openweathermap.org/img/wn/${
                    dayForecast.weather[0].icon
                  }@2x.png" alt ="${dayForecast.weather[0].description}"
            />
          </span>
        <div class="forecast-temperature">
          <span class="forecast-temperature-max"> ${Math.round(
            dayForecast.temp.max
          )}??</span>
          <span class="forecast-temperature-min"> ${Math.round(
            dayForecast.temp.min
          )}??</span>
       </div>
   </div>
`;
  });
}
function formatDateForecast(dt) {
  let date = new Date(dt);
  let day = date.getDay(dt);
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

displayForecast();

function getForecastData(coord) {
  console.log(coord);
  let link = `
 https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric
 `;
  axios.get(link).then(displayForecast);
  console.log(link);
}
