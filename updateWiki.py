import json
import urllib.request
import re

CURATED_MOVIES = {
  "Action": ["The Dark Knight (film)", "Inception", "Mad Max: Fury Road", "Gladiator (2000 film)"],
  "Comedy": ["The Hangover", "Superbad", "Dumb and Dumber"],
  "Drama": ["The Shawshank Redemption", "Forrest Gump", "The Godfather"],
  "Music": ["Rockstar (2011 film)", "Aashiqui 2", "Gully Boy"],
  "Sports": ["M.S. Dhoni: The Untold Story", "Dangal (film)", "83 (film)"],
  "Thriller": ["Shutter Island", "The Silence of the Lambs (film)", "Seven (1995 film)"],
  "Fantasy": ["The Lord of the Rings: The Fellowship of the Ring", "Avatar (2009 film)", "Spirited Away"],
  "Romance": ["Titanic (1997 film)", "The Notebook (2004 film)", "Before Sunrise"]
}

def get_wiki_image(title):
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&format=json&pithumbsize=600"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data['query']['pages']
            for page_id in pages:
                if 'thumbnail' in pages[page_id]:
                    return pages[page_id]['thumbnail']['source']
    except Exception as e:
        print(f"Error fetching {title}: {e}")
    return "N/A"

def main():
    with open('./src/services/curatedMovies.js', 'r', encoding='utf-8') as f:
        content = f.read()

    for cat, titles in CURATED_MOVIES.items():
        for title in titles:
            img = get_wiki_image(title)
            # Remove disambiguation for the regex search
            base_title = title.split(' (')[0].split(': ')[0]
            if base_title == "Seven": base_title = "Se7en"
            if base_title == "The Lord of the Rings": base_title = "Lord of the Rings"
            if img != "N/A":
                print(f"Updated {base_title} with {img}")
                regex = re.compile(r'(Title:\s*"' + re.escape(base_title) + r'".*?Poster:\s*")([^"]+)(")', re.IGNORECASE | re.DOTALL)
                content = regex.sub(r'\g<1>' + img + r'\g<3>', content)

    with open('./src/services/curatedMovies.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("All done!")

if __name__ == "__main__":
    main()
