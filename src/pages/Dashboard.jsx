import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget from "../components/NewsWidget";
import TimerWidget from "../components/TimerWidget";
import NotesWidget from "../components/NotesWidget";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, categories, apiKeys, setApiKeys, resetStore } = useStore();

  // Settings Panel state
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState({
    omdb: apiKeys.omdb || "",
    openweather: apiKeys.openweather || "",
  });
  const [showOmdbKey, setShowOmdbKey] = useState(false);
  const [showWeatherKey, setShowWeatherKey] = useState(false);

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
          {/* Browse Movies */}
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

      {/* Main Grid Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 xl:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Profile + Weather + Timer */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6 md:col-span-1 lg:col-span-1">
          
          {/* User Profile Widget */}
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

          <WeatherWidget />

          <TimerWidget />

        </div>

        {/* Middle Column: Notes Widget */}
        <div className="md:col-span-1 lg:col-span-1 h-full">
          <NotesWidget />
        </div>

        {/* Right Column: News Widget */}
        <div className="md:col-span-1 lg:col-span-1 h-full">
          <NewsWidget />
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
