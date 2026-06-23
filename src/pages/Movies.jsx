import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { searchMovieByGenre } from "../services/apiServices";
import MovieModal from "../components/MovieModal";

const Movies = () => {
  const navigate = useNavigate();
  const { categories, apiKeys } = useStore();

  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch movie data for all selected genres
  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true);
      setError("");
      
      try {
        const results = {};
        // Run searches in parallel for efficiency
        await Promise.all(
          categories.map(async (category) => {
            const list = await searchMovieByGenre(category, apiKeys.omdb);
            results[category] = list;
          })
        );
        setMoviesByCategory(results);
      } catch (err) {
        console.error("Error fetching movies by category:", err);
        setError("Unable to retrieve movie listings. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchAllMovies();
    }
  }, [categories, apiKeys.omdb]);

  // Color chips mapping helper for headers
  const categoryColors = {
    Action: "bg-red-500/10 text-red-500 border-red-500/20",
    Comedy: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Drama: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Music: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Sports: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Thriller: "bg-green-500/10 text-green-400 border-green-500/20",
    Fantasy: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    Romance: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col font-sans">
      
      {/* Navigation Header */}
      <header className="px-4 sm:px-6 md:px-10 py-4 flex justify-between items-center bg-[#0d0d12]/60 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span
            className="text-xl sm:text-2xl font-black font-heading tracking-widest text-accentNeon cursor-pointer flex-shrink-0"
            onClick={() => navigate("/dashboard")}
          >
            SUPERAPP
          </span>
          <span className="text-gray-600 font-semibold text-lg hidden sm:inline">|</span>
          <span className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline truncate">
            Entertainment Recommendations
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs py-2 px-3 sm:px-5 rounded-full transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Recommendations Container */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 xl:p-12 max-w-7xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-heading tracking-tight">
            Curated Entertainment for You
          </h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accentNeon animate-pulse" />
            Based on your onboarding preferences
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 flex-1">
            <span className="w-9 h-9 rounded-full border-2 border-accentNeon border-t-transparent animate-spin" />
            <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Compiling recommended catalogs...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold p-5 rounded-2xl text-center max-w-md mx-auto">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {categories.map((category) => {
              const movies = moviesByCategory[category] || [];
              const colorClass = categoryColors[category] || "bg-white/5 text-white border-white/10";
              
              return (
                <div key={category} className="flex flex-col gap-4 border-b border-white/5 pb-8 last:border-0 last:pb-0">
                  {/* Category Shelf Header */}
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-wide text-white font-heading">
                      {category}
                    </h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 border rounded-full ${colorClass}`}>
                      Genre
                    </span>
                  </div>

                  {/* Horizontal Scroll Shelf */}
                  {movies.length === 0 ? (
                    <div className="bg-white/5 border border-white/5 py-8 text-center rounded-2xl text-xs text-gray-500 font-semibold">
                      No matching movies found in OMDB. Enter an API key in dashboard settings or use our default curation.
                    </div>
                  ) : (
                    <div className="flex overflow-x-auto gap-3 sm:gap-5 pb-4 pt-1 snap-x scroll-smooth -mx-4 px-4 sm:-mx-0 sm:px-0">
                      {movies.map((movie) => (
                        <div
                          key={movie.imdbID}
                          onClick={() => setSelectedMovieId(movie.imdbID)}
                          className="flex-shrink-0 w-[150px] sm:w-[190px] md:w-[210px] bg-[#121216]/50 border border-white/5 rounded-2xl overflow-hidden cursor-pointer select-none snap-start transform hover:scale-[1.05] transition-all duration-300 ease-out hover:shadow-[0_0_20px_rgba(29,248,169,0.2)] hover:border-accentNeon/30 group"
                        >
                          {/* Poster Container */}
                          <div className="h-[210px] sm:h-[260px] md:h-[290px] bg-black overflow-hidden relative">
                            <img 
                              src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"} 
                              alt={movie.Title}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                              <span className="bg-accentNeon text-black text-[9px] font-black tracking-widest uppercase py-1 px-3 rounded-full shadow-md">
                                VIEW INFO
                              </span>
                            </div>
                          </div>

                          {/* Movie Metadata */}
                          <div className="p-4 flex flex-col gap-1 bg-[#13131a]">
                            <span className="text-[10px] text-gray-500 font-bold font-mono">
                              {movie.Year}
                            </span>
                            <h4 className="font-bold text-sm text-white truncate group-hover:text-accentNeon transition-colors leading-tight">
                              {movie.Title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Movie Details Modal Overlay */}
      {selectedMovieId && (
        <MovieModal 
          imdbID={selectedMovieId} 
          apiKey={apiKeys.omdb}
          onClose={() => setSelectedMovieId(null)}
        />
      )}

    </div>
  );
};

export default Movies;
