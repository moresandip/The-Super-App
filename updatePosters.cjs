const fs = require('fs');
const https = require('https');

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

const fetchPoster = (title) => {
  return new Promise((resolve) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=movie&limit=1`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            // Get high-res artwork
            const artwork = parsed.results[0].artworkUrl100.replace('100x100bb', '600x600bb');
            resolve(artwork);
          } else {
            resolve("N/A");
          }
        } catch (e) {
          resolve("N/A");
        }
      });
    }).on('error', () => resolve("N/A"));
  });
};

async function main() {
  const content = fs.readFileSync('./src/services/curatedMovies.js', 'utf8');
  let newContent = content;

  for (const category of Object.keys(CURATED_MOVIES)) {
    for (const title of CURATED_MOVIES[category]) {
      const poster = await fetchPoster(title);
      if (poster !== "N/A") {
        console.log(`Found poster for ${title}: ${poster}`);
        // Regex to replace the specific poster for this movie. 
        // We look for Title: "title" and then the next Poster line.
        const regex = new RegExp(`(Title:\\s*"${title.replace(/[.*+?^$\/{}()|\\[\\]\\\\]/g, '\\\\$&')}",[\\s\\S]*?Poster:\\s*")([^"]+)(")`, 'i');
        newContent = newContent.replace(regex, `$1${poster}$3`);
      } else {
        console.log(`No poster for ${title}`);
      }
    }
  }

  fs.writeFileSync('./src/services/curatedMovies.js', newContent);
  console.log("Finished updating posters!");
}

main();
