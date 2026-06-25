import React from "react";

const MovieCard = ({ movie, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full aspect-[16/9] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
    >
      <img 
        src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop"} 
        alt={movie.Title}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default MovieCard;
