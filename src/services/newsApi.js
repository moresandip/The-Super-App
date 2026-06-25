import axios from "axios";

const newsClient = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export const fetchTopHeadlines = async (category = "general", apiKey = "") => {
  let newsCategory = "general";
  const catLower = category.toLowerCase();
  
  if (catLower === "sports") {
    newsCategory = "sports";
  } else if (["music", "comedy", "drama", "action", "romance", "fantasy", "thriller"].includes(catLower)) {
    newsCategory = "entertainment";
  }

  if (apiKey && apiKey.trim()) {
    try {
      const response = await newsClient.get(`/top-headlines?category=${newsCategory}&language=en&apiKey=${apiKey}`);
      return response.data.articles || [];
    } catch (error) {
      console.error("NewsAPI endpoint failure, falling back to mirror:", error);
    }
  }

  try {
    const response = await axios.get(`https://saurav.tech/NewsAPI/top-headlines/category/${newsCategory}/in.json`);
    return response.data.articles || [];
  } catch (error) {
    console.error("News service failure:", error);
    throw error;
  }
};
