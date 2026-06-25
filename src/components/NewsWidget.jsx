import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { fetchTopHeadlines } from "../services/newsApi";

const NewsWidget = () => {
  const { categories } = useStore();

  const [articles, setArticles] = useState([]);
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [newsLoading, setNewsLoading] = useState(true);
  const [isNewsHovered, setIsNewsHovered] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      try {
        const primaryCategory = categories[0] || "general";
        const newsArticles = await fetchTopHeadlines(primaryCategory);
        const validArticles = newsArticles.filter(a => a.title && a.urlToImage);
        setArticles(validArticles.length > 0 ? validArticles : newsArticles);
      } catch (err) {
        console.error("News load error:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, [categories]);

  useEffect(() => {
    if (articles.length === 0 || isNewsHovered) return;

    const interval = setInterval(() => {
      setActiveArticleIndex((prevIndex) => (prevIndex + 1) % articles.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [articles, isNewsHovered]);

  return (
    <div 
      className="bg-widgetBg border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-lg lg:col-span-1 min-h-[320px] sm:min-h-[400px] relative group h-full"
      onMouseEnter={() => setIsNewsHovered(true)}
      onMouseLeave={() => setIsNewsHovered(false)}
    >
      {newsLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16">
          <span className="w-8 h-8 rounded-full border-2 border-accentNeon border-t-transparent animate-spin" />
          <span className="text-xs text-gray-400 font-semibold tracking-wider">Loading real-time news...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex items-center justify-center flex-1 text-xs text-gray-500 py-16 font-semibold">
          No news articles available.
        </div>
      ) : (
        <div className="flex flex-col h-full relative">
          <div className="w-full h-[45%] min-h-[170px] relative overflow-hidden flex-shrink-0">
            <img 
              src={articles[activeArticleIndex]?.urlToImage} 
              alt={articles[activeArticleIndex]?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div className="absolute top-4 left-4 bg-black/80 border border-white/10 rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wide uppercase text-accentNeon backdrop-blur-sm">
              {articles[activeArticleIndex]?.source?.name || "News Feed"}
            </div>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between gap-4 overflow-hidden bg-[#13131a]">
            <div className="flex flex-col gap-2.5 overflow-hidden">
              <h3 className="font-bold text-base md:text-lg leading-snug tracking-tight text-white hover:text-accentNeon transition-colors line-clamp-3">
                <a href={articles[activeArticleIndex]?.url} target="_blank" rel="noopener noreferrer">
                  {articles[activeArticleIndex]?.title}
                </a>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-5">
                {articles[activeArticleIndex]?.description || "No article summary is currently provided. Click the title to read the full scoop from the source."}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-3.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {articles[activeArticleIndex]?.publishedAt ? new Date(articles[activeArticleIndex].publishedAt).toLocaleDateString() : ""}
              </span>
              {isNewsHovered && (
                <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                  Hover paused
                </span>
              )}
              {!isNewsHovered && (
                <span className="text-[9px] text-gray-600 font-semibold uppercase tracking-wider">
                  Auto-rotating
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsWidget;
