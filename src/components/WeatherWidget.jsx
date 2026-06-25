import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { fetchCurrentWeather } from "../services/weatherApi";

const WeatherWidget = () => {
  const { apiKeys } = useStore();

  const [weather, setWeather] = useState(null);
  const [weatherCity, setWeatherCity] = useState("New Delhi");
  const [weatherSearch, setWeatherSearch] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  // Fetch Weather on Mount / City Change / API Key Change
  useEffect(() => {
    const loadWeather = async () => {
      setWeatherLoading(true);
      setWeatherError("");
      try {
        const data = await fetchCurrentWeather(weatherCity, apiKeys.openweather);
        setWeather(data);
      } catch (err) {
        setWeatherError("Weather fetch failed. Try searching another city.");
      } finally {
        setWeatherLoading(false);
      }
    };
    loadWeather();
  }, [weatherCity, apiKeys.openweather]);

  // Attempt browser geolocation on mount to set local weather
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`);
            const data = await response.json();
            if (data.current) {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
              const geoData = await geoRes.json();
              const detectedCity = geoData.address?.city || geoData.address?.town || geoData.address?.state || "Local Coordinates";
              
              const mapMeteoCode = (code) => {
                if (code === 0) return { condition: "Clear Sky", iconCode: "01d" };
                if ([1, 2, 3].includes(code)) return { condition: "Partly Cloudy", iconCode: "03d" };
                if ([45, 48].includes(code)) return { condition: "Foggy", iconCode: "50d" };
                if ([51, 53, 55].includes(code)) return { condition: "Drizzle", iconCode: "09d" };
                if ([61, 63, 65].includes(code)) return { condition: "Rainy", iconCode: "10d" };
                if ([71, 73, 75].includes(code)) return { condition: "Snowy", iconCode: "13d" };
                if ([80, 81, 82].includes(code)) return { condition: "Showers", iconCode: "09d" };
                return { condition: "Clear Sky", iconCode: "01d" };
              };
              
              const mapped = mapMeteoCode(data.current.weather_code);
              setWeather({
                temp: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                pressure: data.current.surface_pressure,
                windSpeed: data.current.wind_speed_10m,
                condition: mapped.condition,
                iconCode: mapped.iconCode,
                cityName: detectedCity,
                country: geoData.address?.country_code?.toUpperCase() || "",
              });
              setWeatherCity(detectedCity);
              setWeatherLoading(false);
            }
          } catch (e) {
            console.error("Local Geolocation weather fetch failed:", e);
          }
        },
        (error) => {
          console.log("Geolocation permission denied or failed, using New Delhi default.");
        }
      );
    }
  }, []);

  const handleCitySearchSubmit = (e) => {
    e.preventDefault();
    if (weatherSearch.trim()) {
      setWeatherCity(weatherSearch.trim());
      setWeatherSearch("");
    }
  };

  return (
    <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-6 flex flex-col justify-between gap-4 shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-1.5">
            <span className="text-accentNeon">📍</span>
            {weatherCity} {weather?.country ? `, ${weather.country}` : ""}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })} | {new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <form onSubmit={handleCitySearchSubmit} className="flex bg-white/5 border border-white/10 rounded-full px-3 py-1 items-center max-w-[130px]">
          <input 
            type="text" 
            placeholder="Search City" 
            value={weatherSearch}
            onChange={(e) => setWeatherSearch(e.target.value)}
            className="bg-transparent border-none text-[11px] font-semibold text-white outline-none w-full placeholder-gray-500"
          />
          <button type="submit" className="text-gray-400 hover:text-white ml-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {weatherLoading ? (
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          <span className="w-7 h-7 rounded-full border-2 border-accentNeon border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-medium">Fetching live weather...</span>
        </div>
      ) : weatherError ? (
        <div className="text-red-500 text-xs font-semibold py-4 text-center">{weatherError}</div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.iconCode}@2x.png`} 
              alt={weather.condition}
              className="w-16 h-16 bg-white/5 rounded-full border border-white/5"
            />
            <div>
              <h2 className="text-3xl font-black tracking-tight">{Math.round(weather.temp)}°C</h2>
              <p className="text-sm font-semibold text-gray-300 mt-0.5">{weather.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-5 gap-y-1.5 text-right border-l border-white/10 pl-5">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Wind</span>
              <span className="text-xs font-bold text-gray-200">{weather.windSpeed}m/s</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Humidity</span>
              <span className="text-xs font-bold text-gray-200">{weather.humidity}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Pressure</span>
              <span className="text-xs font-bold text-gray-200">{weather.pressure}hPa</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
