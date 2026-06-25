import axios from "axios";
import { CURATED_MOVIES } from "./curatedMovies";

const movieClient = axios.create({
  baseURL: "https://www.omdbapi.com/",
});

export const searchMovieByGenre = async (query = "Action", apiKey = "") => {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await movieClient.get(`/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`);
      return response.data.Search || [];
    } catch (error) {
      console.error("Movie query service failure, falling back to local database:", error);
    }
  }

  const matchedKey = Object.keys(CURATED_MOVIES).find(
    (key) => key.toLowerCase() === query.toLowerCase()
  );

  if (matchedKey && CURATED_MOVIES[matchedKey]) {
    return CURATED_MOVIES[matchedKey];
  }

  const allCurated = Object.values(CURATED_MOVIES).flat();
  const searchResults = allCurated.filter(m => 
    m.Title.toLowerCase().includes(query.toLowerCase()) ||
    m.Genre.toLowerCase().includes(query.toLowerCase())
  );
  return searchResults.length > 0 ? searchResults : allCurated.slice(0, 4);
};

export const fetchMovieDetails = async (imdbID, apiKey = "") => {
  if (apiKey && apiKey.trim()) {
    try {
      const response = await movieClient.get(`/?i=${imdbID}&plot=full&apikey=${apiKey}`);
      return response.data;
    } catch (error) {
      console.error("Movie detail payload query error, falling back to local database:", error);
    }
  }

  const allCurated = Object.values(CURATED_MOVIES).flat();
  const matchedMovie = allCurated.find((m) => m.imdbID === imdbID);
  
  if (matchedMovie) {
    return matchedMovie;
  }

  throw new Error(`Movie with ID ${imdbID} not found in database.`);
};
