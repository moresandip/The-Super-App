import axios from "axios";
import { CURATED_MOVIES } from "./curatedMovies";

// Standard HTTP Configurations
const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});

const newsClient = axios.create({
  baseURL: "https://newsapi.org/v2",
});

const movieClient = axios.create({
  baseURL: "https://www.omdbapi.com/",
});

// Helper: Map Open-Meteo weather codes to standard readable descriptions and icon codes
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

// Weather Fetcher Method
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
    // 1. Geocode City Name using keyless Open-Meteo Geocoding API
    const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoResult = geoResponse.data?.results?.[0];
    
    if (!geoResult) {
      throw new Error(`City "${city}" not found.`);
    }

    const { latitude, longitude, name, country } = geoResult;

    // 2. Fetch current weather conditions
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

// News Fetcher Method
export const fetchTopHeadlines = async (category = "general", apiKey = "") => {
  // Map our app categories to Saurav's news categories
  // Saurav Categories: business, entertainment, general, health, science, sports, technology
  let newsCategory = "general";
  const catLower = category.toLowerCase();
  
  if (catLower === "sports") {
    newsCategory = "sports";
  } else if (["music", "comedy", "drama", "action", "romance", "fantasy", "thriller"].includes(catLower)) {
    newsCategory = "entertainment";
  }

  // If a news key is provided, we can hit NewsAPI (note: free NewsAPI keys have CORS blocks in browsers)
  if (apiKey && apiKey.trim()) {
    try {
      const response = await newsClient.get(`/top-headlines?category=${newsCategory}&language=en&apiKey=${apiKey}`);
      return response.data.articles || [];
    } catch (error) {
      console.error("NewsAPI endpoint failure, falling back to mirror:", error);
    }
  }

  // Primary mirror fetch (works seamlessly in-browser with no auth keys)
  try {
    const response = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${newsCategory}/in.json`);
    return response.data.articles || [];
  } catch (error) {
    console.error("News service failure:", error);
    throw error;
  }
};

// Movie Fetcher Method (genre query)
export const searchMovieByGenre = async (query = "Action", apiKey = "") => {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await movieClient.get(`/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`);
      return response.data.Search || [];
    } catch (error) {
      console.error("Movie query service failure, falling back to local database:", error);
    }
  }

  // Fallback: Return curated local movies matching category
  // Let's perform a case-insensitive check
  const matchedKey = Object.keys(CURATED_MOVIES).find(
    (key) => key.toLowerCase() === query.toLowerCase()
  );

  if (matchedKey && CURATED_MOVIES[matchedKey]) {
    return CURATED_MOVIES[matchedKey];
  }

  // General search fallback if query isn't a specific category
  const allCurated = Object.values(CURATED_MOVIES).flat();
  const searchResults = allCurated.filter(m => 
    m.Title.toLowerCase().includes(query.toLowerCase()) ||
    m.Genre.toLowerCase().includes(query.toLowerCase())
  );
  return searchResults.length > 0 ? searchResults : allCurated.slice(0, 4);
};

// Detailed Movie Fetcher Method (individual info)
export const fetchMovieDetails = async (imdbID, apiKey = "") => {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await movieClient.get(`/?i=${imdbID}&plot=full&apikey=${apiKey}`);
      return response.data;
    } catch (error) {
      console.error("Movie detail payload query error, falling back to local database:", error);
    }
  }

  // Fallback: Locate movie in our local database
  const allCurated = Object.values(CURATED_MOVIES).flat();
  const matchedMovie = allCurated.find((m) => m.imdbID === imdbID);
  
  if (matchedMovie) {
    return matchedMovie;
  }

  throw new Error(`Movie with ID ${imdbID} not found in database.`);
};
