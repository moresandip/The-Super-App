import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { searchMovieByGenre } from "../services/apiServices";
import MovieModal from "../components/MovieModal";

const Movies = () => {
  const navigate = useNavigate();
  const { categories, apiKeys, user } = useStore();

  const [moviesByCategory, setMoviesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch movie data for the selected categories
  useEffect(() => {
    const fetchSelectedMovies = async () => {
      setLoading(true);
      try {
        const results = {};
        await Promise.all(
          categories.map(async (category) => {
            const list = await searchMovieByGenre(category, apiKeys.omdb);
            results[category] = list.slice(0, 4);
          })
        );
        setMoviesByCategory(results);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categories && categories.length > 0) {
      fetchSelectedMovies();
    } else {
      setMoviesByCategory({});
      setLoading(false);
    }
  }, [categories, apiKeys.omdb]);

  return (
    <div className="min-h-screen bg-[#07070a] text-white flex flex-col font-sans">
      
      {/* Navigation Header */}
      <header className="px-6 md:px-12 py-6 flex justify-between items-center">
        <span
          className="text-xl sm:text-2xl font-black font-heading tracking-widest text-accentNeon cursor-pointer flex-shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          SUPERAPP
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-bold text-xs sm:text-sm rounded-full py-2 px-4 sm:px-5 hover:scale-[1.02] active:scale-[0.98] transition-all select-none"
          >
            ← Back to Dashboard
          </button>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent hover:border-green-400 transition-all cursor-pointer">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover bg-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-6 md:px-12 pb-12 w-full flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold mb-8">
          Entertainment according to your choice
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {categories.map((category) => {
              const movies = moviesByCategory[category] || [];
              if (movies.length === 0) return null;
              
              return (
                <div key={category} className="flex flex-col gap-4">
                  {/* Category Header */}
                  <h3 className="text-lg text-gray-400 font-medium">
                    {category}
                  </h3>

                  {/* Grid of 4 Posters */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {movies.map((movie, idx) => (
                      <div
                        key={movie.imdbID || idx}
                        onClick={() => setSelectedMovieId(movie.imdbID)}
                        className="w-full aspect-[16/9] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
                      >
                        <img 
                          src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"} 
                          alt={movie.Title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
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
