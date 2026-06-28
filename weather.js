const weatherStatus = document.querySelector("#weather-status");
const weatherCurrent = document.querySelector("#weather-current");
const weatherForecast = document.querySelector("#weather-forecast");
const weatherTemperature = document.querySelector("#weather-temperature");
const weatherCondition = document.querySelector("#weather-condition");
const weatherHumidity = document.querySelector("#weather-humidity");
const weatherWind = document.querySelector("#weather-wind");
const weatherRefresh = document.querySelector("#weather-refresh");

const suwaneeWeatherUrl =
  "https://api.open-meteo.com/v1/forecast?latitude=34.0515&longitude=-84.0713&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=celsius&wind_speed_unit=kmh&timezone=America%2FNew_York&forecast_days=5";

const weatherCodes = {
  0: "Ясно",
  1: "Почти ясно",
  2: "Переменная облачность",
  3: "Пасмурно",
  45: "Туман",
  48: "Иней и туман",
  51: "Легкая морось",
  53: "Морось",
  55: "Сильная морось",
  61: "Небольшой дождь",
  63: "Дождь",
  65: "Сильный дождь",
  71: "Небольшой снег",
  73: "Снег",
  75: "Сильный снег",
  80: "Небольшой ливень",
  81: "Ливень",
  82: "Сильный ливень",
  95: "Гроза",
  96: "Гроза с градом",
  99: "Сильная гроза с градом",
};

const dayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const formatTemperature = (value) => `${Math.round(value)}°C`;

const getWeatherLabel = (code) => weatherCodes[code] || "Прогноз обновляется";

const setWeatherLoading = () => {
  weatherStatus.textContent = "Загружаю прогноз...";
  weatherCurrent.hidden = true;
  weatherForecast.hidden = true;
  weatherRefresh.disabled = true;
};

const setWeatherError = () => {
  weatherStatus.textContent =
    "Не получилось загрузить прогноз. Проверь интернет и попробуй обновить.";
  weatherCurrent.hidden = true;
  weatherForecast.hidden = true;
  weatherRefresh.disabled = false;
};

const renderForecast = (daily) => {
  weatherForecast.innerHTML = daily.time
    .map((date, index) => {
      const day = dayFormatter.format(new Date(`${date}T12:00:00`));
      const high = formatTemperature(daily.temperature_2m_max[index]);
      const low = formatTemperature(daily.temperature_2m_min[index]);
      const rain = daily.precipitation_probability_max[index];
      const label = getWeatherLabel(daily.weather_code[index]);

      return `
        <div class="weather-day">
          <p class="weather-day-name">${day}</p>
          <p class="weather-day-condition">${label}</p>
          <p class="weather-day-temp">${high} / ${low}</p>
          <p class="weather-day-rain">Дождь: ${rain}%</p>
        </div>
      `;
    })
    .join("");
};

const loadWeather = async () => {
  if (!weatherStatus || !weatherRefresh) {
    return;
  }

  setWeatherLoading();

  try {
    const response = await fetch(suwaneeWeatherUrl);

    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = await response.json();

    weatherTemperature.textContent = formatTemperature(data.current.temperature_2m);
    weatherCondition.textContent = getWeatherLabel(data.current.weather_code);
    weatherHumidity.textContent = `${data.current.relative_humidity_2m}%`;
    weatherWind.textContent = `${Math.round(data.current.wind_speed_10m)} км/ч`;
    renderForecast(data.daily);

    weatherStatus.textContent = "Прогноз обновлен для Suwanee, Georgia.";
    weatherCurrent.hidden = false;
    weatherForecast.hidden = false;
    weatherRefresh.disabled = false;
  } catch (error) {
    setWeatherError();
  }
};

if (weatherRefresh) {
  weatherRefresh.addEventListener("click", loadWeather);
  loadWeather();
}
