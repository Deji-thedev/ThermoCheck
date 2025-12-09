const API_KEY = "1ea8e92e6e5771322a6751336bab91d6";
const API_URL = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});

async function getWeatherData(city) {
  try {
    const response = await fetch(
      `${API_URL}/weather?q=${city}&appid=${API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    updateCurrentWeather(data);

    getForecastData(data.coord.lat, data.coord.lon);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

function updateCurrentWeather(data) {
  const cityName = document.querySelector(".city-name");
  const date = document.querySelector(".date");
  const weatherIcon = document.querySelector(".weather-icon");
  const temperature = document.querySelector(".temperature");
  const weatherDescription = document.querySelector(".weather-description");
  const descriptionDetail = document.querySelector(".description-detail");

  cityName.textContent = `${data.name}, ${data.sys.country}`;

  const today = new Date();
  const options = { month: "long", day: "numeric" };
  date.textContent = `Today, ${today.toLocaleDateString("en-US", options)}`;

  const mainWeather = data.weather[0].main;
  weatherIcon.textContent = weatherIcons[mainWeather] || "☀️";

  temperature.textContent = `${Math.round(data.main.temp)}°`;

  weatherDescription.textContent = data.weather[0].main;
  descriptionDetail.textContent = data.weather[0].description;

  updateWeatherDetails(data);
}

function updateWeatherDetails(data) {
  const detailValues = document.querySelectorAll(".detail-value");

  detailValues[0].textContent = `${Math.round(data.main.feels_like)}°`;
  detailValues[1].textContent = `${data.main.humidity}%`;
  detailValues[2].textContent = `${Math.round(data.wind.speed)} mph`;
  detailValues[3].textContent = `${(data.main.pressure * 0.02953).toFixed(1)}"`; // Convert hPa to inches
}

async function getForecastData(lat, lon) {
  try {
    const response = await fetch(
      `${API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error("Forecast not available");
    }

    const data = await response.json();
    updateForecast(data);
  } catch (error) {
    console.error("Forecast error:", error);
  }
}

function updateForecast(data) {
  const forecastCards = document.querySelectorAll(".forecast-card");

  const dailyForecasts = data.list
    .filter((item) => item.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  dailyForecasts.forEach((forecast, index) => {
    const card = forecastCards[index];
    const date = new Date(forecast.dt * 1000);
    const dayName =
      index === 0
        ? "Today"
        : date.toLocaleDateString("en-US", { weekday: "short" });

    const day = card.querySelector(".forecast-day");
    const icon = card.querySelector(".forecast-icon");
    const temp = card.querySelector(".forecast-temp");
    const low = card.querySelector(".forecast-low");

    day.textContent = dayName;
    icon.textContent = weatherIcons[forecast.weather[0].main] || "☀️";
    temp.textContent = `${Math.round(forecast.main.temp_max)}°`;
    low.textContent = `${Math.round(forecast.main.temp_min)}°`;
  });
}

window.addEventListener("load", () => {
  getWeatherData("New York");
});
