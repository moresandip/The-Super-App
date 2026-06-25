import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import CategoryCard from "../components/CategoryCard";

const icons = {
  Action: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  Comedy: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
    </svg>
  ),
  Drama: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
    </svg>
  ),
  Music: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0v11.25m0-11.25L9 9m10.5-3V3M9 9V6M9 9v11.25m0 0a3 3 0 11-6 0 3 3 0 016 0zm10.5-3a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Sports: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.64 8.38m6 .37l-5.63 5.63m0 0l-4.82-4.82m4.82 4.82L3.63 21" />
    </svg>
  ),
  Thriller: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  Fantasy: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l5.438-3.125M21 3L9.813 14.187m0 0a3.375 3.375 0 11-4.773-4.773 3.375 3.375 0 014.773 4.773z" />
    </svg>
  ),
  Romance: (
    <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 opacity-75" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
};

const categoryDetails = [
  { id: "Action",   label: "Action",   color: "bg-[#FF5252]", textColor: "text-white" },
  { id: "Comedy",   label: "Comedy",   color: "bg-[#C575CD]", textColor: "text-white" },
  { id: "Drama",    label: "Drama",    color: "bg-[#7358FF]", textColor: "text-white" },
  { id: "Music",    label: "Music",    color: "bg-[#E8DD30]", textColor: "text-black" },
  { id: "Sports",   label: "Sports",   color: "bg-[#84C2FF]", textColor: "text-black" },
  { id: "Thriller", label: "Thriller", color: "bg-[#25a816]", textColor: "text-white" },
  { id: "Fantasy",  label: "Fantasy",  color: "bg-[#FF4EAD]", textColor: "text-white" },
  { id: "Romance",  label: "Romance",  color: "bg-[#FF3B62]", textColor: "text-white" },
];

const Categories = () => {
  const categories   = useStore((state) => state.categories);
  const setCategories = useStore((state) => state.setCategories);
  const user         = useStore((state) => state.user);
  const navigate     = useNavigate();

  const handleToggle = (catId) => {
    setCategories(
      categories.includes(catId)
        ? categories.filter((c) => c !== catId)
        : [...categories, catId]
    );
  };

  const handleRemove = (catId) =>
    setCategories(categories.filter((c) => c !== catId));

  const handleContinue = () => {
    if (categories.length >= 3) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">

      {/* ── MOBILE HEADER (visible only on sm and below) ── */}
      <div className="lg:hidden px-5 pt-8 pb-4 flex flex-col gap-3">
        <h1 className="text-accentNeon text-2xl font-heading font-black tracking-widest">
          SUPER APP
        </h1>
        <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
          Choose your categories
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Select at least <span className="text-accentNeon font-bold">3 genres</span> to continue
        </p>

        {/* Selected chips — mobile */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {categories.map((catId) => (
              <div
                key={catId}
                className="flex items-center gap-1.5 bg-accentNeon/15 border border-accentNeon/30 text-white rounded-full px-3 py-1 text-xs font-bold"
              >
                {catId}
                <button onClick={() => handleRemove(catId)} className="hover:text-red-400 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-col lg:flex-row px-5 pb-10 lg:p-12 xl:p-16 gap-8 lg:gap-14">

        {/* LEFT COLUMN — shown only on lg+ */}
        <aside className="hidden lg:flex w-[32%] xl:w-[30%] flex-col justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div>
              <h1 className="text-accentNeon text-3xl font-heading font-black tracking-widest mb-4">
                SUPER APP
              </h1>
              <h2 className="text-5xl xl:text-6xl font-black font-heading leading-tight tracking-tight">
                Choose your categories of interest
              </h2>
            </div>

            {/* User pill */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-accentNeon animate-pulse" />
              <span className="text-xs font-semibold text-gray-300">Active: {user.username}</span>
            </div>

            {/* Selected chips — desktop */}
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((catId) => (
                <div
                  key={catId}
                  className="flex items-center gap-2 bg-accentNeon/15 border border-accentNeon/30 text-white rounded-full px-4 py-1.5 text-sm font-semibold"
                >
                  {catId}
                  <button onClick={() => handleRemove(catId)} className="hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Warning + Continue button */}
          <div className="flex flex-col gap-3">
            {categories.length < 3 && (
              <div className="flex items-center gap-2 text-red-500 font-semibold text-sm bg-red-500/10 border border-red-500/20 py-3 px-4 rounded-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Minimum 3 categories required
              </div>
            )}
            <button
              onClick={handleContinue}
              disabled={categories.length < 3}
              className={`w-full font-bold text-base py-3.5 px-8 rounded-full transition-all duration-300 select-none ${
                categories.length >= 3
                  ? "bg-accentNeon text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(29,248,169,0.3)]"
                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
              }`}
            >
              Continue
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN — Category Grid */}
        <div className="flex-1 flex flex-col gap-5">
          {/* 2 cols on mobile → 3 cols on sm → 4 cols on lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {categoryDetails.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={categories.includes(cat.id)}
                onToggle={handleToggle}
                icon={icons[cat.id]}
              />
            ))}
          </div>

          {/* MOBILE — sticky bottom Continue bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-md border-t border-white/5 px-5 py-4 flex flex-col gap-2 z-30">
            {categories.length < 3 && (
              <p className="text-red-500 text-xs font-bold text-center">
                Select {3 - categories.length} more to continue
              </p>
            )}
            <button
              onClick={handleContinue}
              disabled={categories.length < 3}
              className={`w-full font-bold text-sm py-3.5 rounded-full transition-all duration-300 select-none ${
                categories.length >= 3
                  ? "bg-accentNeon text-black active:scale-[0.97] shadow-[0_0_15px_rgba(29,248,169,0.3)]"
                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
              }`}
            >
              {categories.length >= 3 ? `Continue (${categories.length} selected)` : `Continue (${categories.length}/3 selected)`}
            </button>
          </div>

          {/* Bottom padding for mobile sticky bar */}
          <div className="lg:hidden h-28" />
        </div>
      </div>
    </div>
  );
};

export default Categories;
