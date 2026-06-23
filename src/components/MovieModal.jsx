import React, { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/apiServices";

const MovieModal = ({ imdbID, apiKey, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMovieDetails(imdbID, apiKey);
        setMovie(data);
      } catch (err) {
        setError("Failed to retrieve movie details.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [imdbID, apiKey]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#121216] border border-white/10 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-2xl relative animate-scale-up overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button at upper right */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 border border-white/10 text-gray-400 hover:text-white hover:bg-black/90 transition-all focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-32 gap-3 text-white">
            <span className="w-9 h-9 rounded-full border-2 border-accentNeon border-t-transparent animate-spin" />
            <span className="text-sm font-semibold tracking-wider">Loading details...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-24 gap-4 px-6 text-center">
            <span className="text-red-500 text-sm font-bold">{error}</span>
            <button 
              onClick={onClose}
              className="bg-white/10 text-white font-bold text-xs py-2 px-5 rounded-full hover:bg-white/20 transition-all"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Left Column: Movie Poster */}
            <div className="w-full md:w-[40%] h-[300px] md:h-auto min-h-[350px] relative flex-shrink-0 bg-black">
              <img 
                src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"} 
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent md:hidden" />
            </div>

            {/* Right Column: Detailed Info */}
            <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
              <div className="flex flex-col gap-4">
                {/* Year & Runtime */}
                <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-wider">
                  <span>{movie.Year}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                  <span>{movie.Runtime && movie.Runtime !== "N/A" ? movie.Runtime : "N/A"}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-black font-heading leading-tight text-white tracking-tight">
                  {movie.Title}
                </h2>

                {/* Rating Badge & Genre tags */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="bg-accentNeon/15 text-accentNeon border border-accentNeon/20 rounded px-2 py-0.5 text-xs font-black tracking-wide">
                    ⭐ {movie.imdbRating && movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "N/A"}
                  </span>
                  
                  {movie.Genre && movie.Genre.split(",").map((genre) => (
                    <span 
                      key={genre.trim()}
                      className="bg-white/5 border border-white/10 rounded px-2.5 py-0.5 text-xs font-semibold text-gray-300"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>

                {/* Plot Synopsis */}
                <div className="mt-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Plot Summary</h4>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    {movie.Plot && movie.Plot !== "N/A" ? movie.Plot : "No plot synopsis available for this title."}
                  </p>
                </div>

                {/* Cast and Director details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-2">
                  <div>
                    <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Director</h5>
                    <p className="text-xs text-gray-300 font-bold">{movie.Director && movie.Director !== "N/A" ? movie.Director : "Unknown"}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Cast Members</h5>
                    <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                      {movie.Actors && movie.Actors !== "N/A" ? movie.Actors : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close footer button */}
              <div className="flex justify-end border-t border-white/5 pt-5 mt-6">
                <button 
                  onClick={onClose}
                  className="bg-accentNeon text-black font-bold text-xs py-2 px-6 rounded-full hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Close Details
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
