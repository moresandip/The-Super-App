import axios from "axios";

const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

const mapMeteoCode = (code) => {
  if (code === 0) return { condition: "Clear Sky", iconCode: "01d" };
  if ([1, 2, 3].includes(code)) return { condition: "Partly Cloudy", iconCode: "03d" };
  if ([45, 48].includes(code)) return { condition: "Foggy", iconCode: "50d" };
  if ([51, 53, 55].includes(code)) return { condition: "Drizzle", iconCode: "09d" };
  if ([61, 63, 65].includes(code)) return { condition: "Rainy", iconCode: "10d" };
  if ([71, 73, 75].includes(code)) return { condition: "Snowy", iconCode: "13d" };
  if ([80, 81, 82].includes(code)) return { condition: "Showers", iconCode: "09d" };
  if (code >= 95) return { condition: "Thunderstorm", iconCode: "11d" };
  return { condition: "Clear Sky", iconCode: "01d" };
};

export const fetchCurrentWeather = async (city = "New Delhi", apiKey = "") => {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await weatherClient.get(`/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`);
      const data = response.data;
      return {
        temp: data.main?.temp,
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        windSpeed: data.wind?.speed,
        condition: data.weather?.[0]?.main || "Clear",
        iconCode: data.weather?.[0]?.icon || "01d",
        cityName: data.name,
        country: data.sys?.country,
      };
    } catch (error) {
      console.error("OpenWeatherMap service failure, falling back to Open-Meteo:", error);
    }
  }

  // Fallback to keyless Open-Meteo
  try {
    const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoResult = geoResponse.data?.results?.[0];
    
    if (!geoResult) {
      throw new Error(`City "${city}" not found.`);
    }

    const { latitude, longitude, name, country } = geoResult;
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`);
    const current = weatherResponse.data?.current;

    if (!current) {
      throw new Error("Failed to retrieve current weather from Open-Meteo.");
    }

    const mapped = mapMeteoCode(current.weather_code);

    return {
      temp: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
      windSpeed: current.wind_speed_10m,
      condition: mapped.condition,
      iconCode: mapped.iconCode,
      cityName: name,
      country: country || "",
    };
  } catch (error) {
    console.error("Weather service failure:", error);
    throw error;
  }
};
