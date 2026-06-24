import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { fetchCurrentWeather, fetchTopHeadlines } from "../services/apiServices";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, categories, notes, setNotes, apiKeys, setApiKeys, resetStore } = useStore();

  // State variables for Widgets
  const [weather, setWeather] = useState(null);
  const [weatherCity, setWeatherCity] = useState("New Delhi");
  const [weatherSearch, setWeatherSearch] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  const [articles, setArticles] = useState([]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [newsLoading, setNewsLoading] = useState(true);
  const [isNewsHovered, setIsNewsHovered] = useState(false);

  // Settings Panel state
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState({
    omdb: apiKeys.omdb || "",
    openweather: apiKeys.openweather || "",
  });
  const [showOmdbKey, setShowOmdbKey] = useState(false);
  const [showWeatherKey, setShowWeatherKey] = useState(false);

  // Timer Widget state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

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
            // Retrieve weather using coords
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code`);
            const data = await response.json();
            if (data.current) {
              // Convert coordinates to city name using reverse geocoding (Open-Meteo geocoding fallback)
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

  // Fetch News headlines
  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      try {
        // Personalize news by fetching category based on user's first choice
        const primaryCategory = categories[0] || "general";
        const newsArticles = await fetchTopHeadlines(primaryCategory);
        
        // Filter articles without images or titles to maintain UI premium standard
        const validArticles = newsArticles.filter(a => a.title && a.urlToImage);
        setArticles(validArticles.length > 0 ? validArticles : newsArticles);
      } catch (err) {
        console.error("News load error:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, [categories]);

  // News Rotation Loop: every 2 seconds, advance index if NOT hovered
  useEffect(() => {
    if (articles.length === 0 || isNewsHovered) return;

    const interval = setInterval(() => {
      setActiveArticleIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [articles, isNewsHovered]);

  // Handle manual city search
  const handleCitySearchSubmit = (e) => {
    e.preventDefault();
    if (weatherSearch.trim()) {
      setWeatherCity(weatherSearch.trim());
      setWeatherSearch("");
    }
  };

  // Web Audio API buzzer synthesizer
  const playBuzzer = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note for pleasant bell sound
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Buzzer audio playback error:", e);
    }
  };

  // Timer countdown loop
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            clearInterval(timerIntervalRef.current);
            playBuzzer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  // Start Timer
  const handleStartTimer = () => {
    if (isTimerRunning) return;
    const computedTotal = (hours * 3600) + (minutes * 60) + seconds;
    if (computedTotal > 0) {
      setTotalSeconds(computedTotal);
      setTimeLeft(computedTotal);
      setIsTimerRunning(true);
    }
  };

  // Pause Timer
  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  // Resume Timer
  const handleResumeTimer = () => {
    if (timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  // Reset Timer
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTotalSeconds(0);
    setTimeLeft(0);
  };

  // Save settings helper
  const handleSaveSettings = () => {
    setApiKeys(tempApiKey);
    setShowSettings(false);
  };

  // Reset App & Log Out
  const handleLogOut = () => {
    resetStore();
    navigate("/");
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate SVG stroke offset for circular timer
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col font-sans relative">
      
      {/* Navigation Header */}
      <header className="px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center bg-[#0d0d12]/60 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <span className="text-xl sm:text-2xl font-black font-heading tracking-widest text-accentNeon cursor-pointer" onClick={() => navigate("/dashboard")}>
          SUPERAPP
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Settings icon */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-white/5 border border-white/10 transition-colors"
            title="Configure API Keys"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.936 6.936 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          {/* Back to Categories */}
          <button
            onClick={() => navigate("/categories")}
            className="bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-bold text-xs sm:text-sm rounded-full py-2 px-3 sm:px-5 hover:scale-[1.02] active:scale-[0.98] transition-all select-none"
          >
            ← Back
          </button>
          {/* Browse Movies — text hidden on tiny screens */}
          <button
            onClick={() => navigate("/movies")}
            className="bg-accentNeon text-black font-bold text-xs sm:text-sm rounded-full py-2 px-3 sm:px-5 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md select-none"
          >
            Movies →
          </button>
          <button
            onClick={handleLogOut}
            className="text-gray-400 hover:text-white font-semibold text-xs sm:text-sm py-1.5 px-2 sm:px-3 transition-colors"
          >
            <span className="hidden sm:inline">Log Out</span>
            <svg className="sm:hidden w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Grid Content
          Mobile  → 1 column (all widgets stacked)
          Tablet  → 2 columns (profile+weather+timer | notes+news)
          Desktop → 3 columns equal split
      */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 xl:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Profile + Weather + Timer — full width mobile, col-span-1 on lg */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 md:col-span-1 lg:col-span-1">
          
          {/* 1. User Profile Widget */}
          <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-6 flex items-start gap-4 sm:gap-5 shadow-lg">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-accentNeon to-purple-600 flex items-center justify-center text-black font-black text-3xl sm:text-4xl shadow-inner flex-shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col justify-between h-full w-full overflow-hidden">
              <div className="mb-2">
                <h3 className="text-gray-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{user.username}</h3>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate leading-tight mt-0.5">{user.name}</h2>
                <h4 className="text-gray-400 text-[11px] sm:text-xs truncate mt-0.5">{user.email}</h4>
                <h4 className="text-gray-500 text-[11px] sm:text-xs mt-0.5">{user.mobile}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[60px] overflow-y-auto mt-2 pr-1">
                {categories.map((cat) => (
                  <span key={cat} className="text-[10px] font-bold bg-[#1df8a9]/10 text-accentNeon rounded-full px-2.5 py-0.5 border border-[#1df8a9]/20">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Weather Widget */}
          <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-6 flex flex-col justify-between gap-4 shadow-lg">
            {/* Header: City, Country and Date */}
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

              {/* City Search Form */}
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
                {/* Temp & Condition */}
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

                {/* Weather Metrics */}
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

          {/* 3. Countdown Timer Widget */}
          <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-lg">

            {/* Top row: Ring (top) + Selectors (bottom) */}
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Circular Ring */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r={radius} className="stroke-white/5 fill-transparent" strokeWidth="6" />
                  <circle
                    cx="56" cy="56" r={radius}
                    className="stroke-accentNeon fill-transparent transition-all duration-1000 ease-linear"
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black font-mono leading-none">
                    {formatTime(timeLeft > 0 ? timeLeft : (hours*3600 + minutes*60 + seconds))}
                  </span>
                  {timeLeft === 0 && !isTimerRunning && (
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">Idle</span>
                  )}
                  {isTimerRunning && (
                    <span className="text-[9px] text-accentNeon font-bold uppercase tracking-wide mt-0.5 animate-pulse">Live</span>
                  )}
                  {timeLeft > 0 && !isTimerRunning && (
                    <span className="text-[9px] text-yellow-400 font-bold uppercase tracking-wide mt-0.5">Paused</span>
                  )}
                </div>
              </div>

              {/* Hr / Min / Sec selectors */}
              <div className="w-full flex-1 flex justify-between sm:justify-around items-center bg-white/5 border border-white/5 rounded-2xl px-3 py-3">
                {/* Hours */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Hr</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setHours(p => Math.max(0, p-1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
                    <span className="text-sm font-black font-mono w-5 text-center">{hours}</span>
                    <button onClick={() => setHours(p => Math.min(23, p+1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
                  </div>
                </div>

                <div className="w-px h-8 bg-white/10" />

                {/* Minutes */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Min</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setMinutes(p => Math.max(0, p-1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
                    <span className="text-sm font-black font-mono w-5 text-center">{minutes}</span>
                    <button onClick={() => setMinutes(p => Math.min(59, p+1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
                  </div>
                </div>

                <div className="w-px h-8 bg-white/10" />

                {/* Seconds */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sec</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSeconds(p => Math.max(0, p-1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">−</button>
                    <span className="text-sm font-black font-mono w-5 text-center">{seconds}</span>
                    <button onClick={() => setSeconds(p => Math.min(59, p+1))} disabled={isTimerRunning}
                      className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Start / Reset / +1 Min */}
            <div className="grid grid-cols-3 gap-2.5">

              {/* Start / Resume / Pause */}
              {!isTimerRunning ? (
                timeLeft > 0 ? (
                  <button onClick={handleResumeTimer}
                    className="bg-accentNeon text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all shadow-[0_0_12px_rgba(29,248,169,0.25)]">
                    Resume
                  </button>
                ) : (
                  <button onClick={handleStartTimer}
                    className="bg-accentNeon text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all shadow-[0_0_12px_rgba(29,248,169,0.25)]">
                    Start
                  </button>
                )
              ) : (
                <button onClick={handlePauseTimer}
                  className="bg-yellow-400 text-black font-bold text-sm py-3 rounded-2xl active:scale-95 transition-all">
                  Pause
                </button>
              )}

              {/* Reset */}
              <button onClick={handleResetTimer}
                className="bg-white/10 border border-white/10 text-white font-bold text-sm py-3 rounded-2xl hover:bg-white/20 active:scale-95 transition-all">
                Reset
              </button>

              {/* +1 Min preset */}
              <button
                onClick={() => { handleResetTimer(); setMinutes(1); }}
                disabled={isTimerRunning}
                className="bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm py-3 rounded-2xl hover:bg-white/10 hover:text-white disabled:opacity-40 active:scale-95 transition-all">
                +1 Min
              </button>

            </div>
          </div>

        </div>

        {/* Middle Column: Notes Widget — full width mobile → col-span-1 desktop */}
        <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-lg lg:col-span-1 min-h-[300px] sm:min-h-[380px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
              <span className="text-yellow-500">📝</span>
              All Notes
            </h3>
            <button 
              onClick={() => setNotes("")}
              className="text-[10px] text-gray-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
            >
              Clear Note
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type quick memos, thoughts, or dashboard notes here... They are automatically saved and will persist across browser page reloads!"
            className="flex-1 w-full bg-transparent border-none text-sm leading-relaxed text-gray-200 outline-none resize-none font-medium placeholder-gray-600 focus:ring-0"
            style={{ 
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
              backgroundSize: "100% 28px",
              lineHeight: "28px"
            }}
          />
        </div>

        {/* Right Column (News Widget - Rotating / Scrollable) */}
        <div 
          className="bg-widgetBg border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-lg lg:col-span-1 min-h-[320px] sm:min-h-[400px] relative group"
          onMouseEnter={() => setIsNewsHovered(true)}
          onMouseLeave={() => setIsNewsHovered(false)}
        >
          {newsLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16">
              <span className="w-8 h-8 rounded-full border-2 border-accentNeon border-t-transparent animate-spin" />
              <span className="text-xs text-gray-400 font-semibold tracking-wider">Loading real-time news...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center flex-1 text-xs text-gray-500 py-16 font-semibold">
              No news articles available.
            </div>
          ) : (
            <div className="flex flex-col h-full relative">
              {/* News Thumbnail Image */}
              <div className="w-full h-[45%] min-h-[170px] relative overflow-hidden flex-shrink-0">
                <img 
                  src={articles[activeArticleIndex]?.urlToImage} 
                  alt={articles[activeArticleIndex]?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                
                {/* News Source Badge Overlay */}
                <div className="absolute top-4 left-4 bg-black/80 border border-white/10 rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wide uppercase text-accentNeon backdrop-blur-sm">
                  {articles[activeArticleIndex]?.source?.name || "News Feed"}
                </div>
              </div>

              {/* News Body Pane */}
              <div className="flex-1 p-5 flex flex-col justify-between gap-4 overflow-hidden bg-[#13131a]">
                <div className="flex flex-col gap-2.5 overflow-hidden">
                  {/* Article Title */}
                  <h3 className="font-bold text-base md:text-lg leading-snug tracking-tight text-white hover:text-accentNeon transition-colors line-clamp-3">
                    <a href={articles[activeArticleIndex]?.url} target="_blank" rel="noopener noreferrer">
                      {articles[activeArticleIndex]?.title}
                    </a>
                  </h3>
                  
                  {/* Article Description */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-5">
                    {articles[activeArticleIndex]?.description || "No article summary is currently provided. Click the title to read the full scoop from the source."}
                  </p>
                </div>

                {/* News Bottom Meta */}
                <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {articles[activeArticleIndex]?.publishedAt ? new Date(articles[activeArticleIndex].publishedAt).toLocaleDateString() : ""}
                  </span>
                  {isNewsHovered && (
                    <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                      Hover paused
                    </span>
                  )}
                  {!isNewsHovered && (
                    <span className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider">
                      Auto-rotating
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1c1c24] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold font-heading text-white">Dashboard Settings</h2>
              <p className="text-xs text-gray-400 mt-1">Configure your API credentials and overrides here. If left blank, the app operates using pre-configured public mirrors and datasets.</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* OMDB Key */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">OMDB API Key</label>
                <div className="relative w-full">
                  <input 
                    type={showOmdbKey ? "text" : "password"} 
                    placeholder="e.g. 8d39c01a" 
                    value={tempApiKey.omdb}
                    onChange={(e) => setTempApiKey({ ...tempApiKey, omdb: e.target.value })}
                    className="w-full bg-[#101014] border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-accentNeon transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOmdbKey(!showOmdbKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showOmdbKey ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* OpenWeather Key */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">OpenWeatherMap API Key</label>
                <div className="relative w-full">
                  <input 
                    type={showWeatherKey ? "text" : "password"} 
                    placeholder="e.g. b29d8a149c..." 
                    value={tempApiKey.openweather}
                    onChange={(e) => setTempApiKey({ ...tempApiKey, openweather: e.target.value })}
                    className="w-full bg-[#101014] border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-accentNeon transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWeatherKey(!showWeatherKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showWeatherKey ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Settings Actions */}
            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => setShowSettings(false)}
                className="bg-white/5 border border-white/5 text-gray-400 hover:text-white font-bold text-xs py-2.5 px-5 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                className="bg-accentNeon text-black font-bold text-xs py-2.5 px-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
