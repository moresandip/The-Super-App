import React from "react";

const CategoryCard = ({ category, isSelected, onToggle, icon }) => {
  return (
    <div
      onClick={() => onToggle(category.id)}
      className={`relative rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between min-h-[130px] sm:min-h-[155px] lg:min-h-[170px] cursor-pointer select-none transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] ${category.color} ${category.textColor} ${
        isSelected
          ? "ring-4 ring-accentNeon shadow-[0_0_20px_rgba(29,248,169,0.25)]"
          : "opacity-90 hover:opacity-100 shadow-md"
      }`}
    >
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold font-heading leading-tight">
        {category.label}
      </h3>
      <div className="flex justify-end items-end">{icon}</div>
      {isSelected && (
        <div className="absolute top-3 right-3 bg-accentNeon text-black rounded-full p-1 border border-black/10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;
