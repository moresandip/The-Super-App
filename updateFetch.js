import fs from 'fs';

const CURATED_MOVIES = {
  Action: ["The Dark Knight", "Inception", "Mad Max: Fury Road", "Gladiator"],
  Comedy: ["The Hangover", "Superbad", "Dumb and Dumber"],
  Drama: ["The Shawshank Redemption", "Forrest Gump", "The Godfather"],
  Music: ["Rockstar", "Aashiqui 2", "Gully Boy"],
  Sports: ["M.S. Dhoni: The Untold Story", "Dangal", "83"],
  Thriller: ["Shutter Island", "The Silence of the Lambs", "Se7en"],
  Fantasy: ["Lord of the Rings", "Avatar", "Spirited Away"],
  Romance: ["Titanic", "The Notebook", "Before Sunrise"]
};

const TMDB_KEY = "15d2ea6d0dc1d476efbca3eba2411a45";

async function fetchPoster(title) {
  try {
    const query = encodeURIComponent(title.split(':')[0]); 
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${query}`;
    const res = await fetch(url);
    const parsed = await res.json();
    if (parsed.results && parsed.results.length > 0 && parsed.results[0].backdrop_path) {
      return `https://image.tmdb.org/t/p/w500${parsed.results[0].backdrop_path}`;
    }
    return "N/A";
  } catch (e) {
    return "N/A";
  }
}

async function main() {
  let content = fs.readFileSync('./src/services/curatedMovies.js', 'utf8');

  for (const category of Object.keys(CURATED_MOVIES)) {
    for (const title of CURATED_MOVIES[category]) {
      const poster = await fetchPoster(title);
      if (poster !== "N/A") {
        console.log(`Updated ${title}`);
        const regex = new RegExp(`(Title:\\s*"${title.replace(/[.*+?^$\/{}()|\\[\\]\\\\]/g, '\\\\$&')}",[\\s\\S]*?Poster:\\s*")([^"]+)(")`, 'i');
        content = content.replace(regex, `$1${poster}$3`);
      }
    }
  }

  fs.writeFileSync('./src/services/curatedMovies.js', content);
  console.log("Done");
}

main();
