import React from "react";
import { useStore } from "../store/useStore";

const NotesWidget = () => {
  const { notes, setNotes } = useStore();

  return (
    <div className="bg-widgetBg border border-white/5 rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-lg h-full min-h-[300px] sm:min-h-[380px]">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h3 className="text-lg font-bold tracking-wide flex items-center gap-2">
          <span className="text-yellow-500">📝</span>
          All Notes
        </h3>
        <button 
          onClick={() => setNotes("")}
          className="text-[10px] text-gray-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors"
        >
          Clear Note
        </button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Type quick memos, thoughts, or dashboard notes here... They are automatically saved and will persist across browser page reloads!"
        className="flex-1 w-full bg-transparent border-none text-sm leading-relaxed text-gray-200 outline-none resize-none font-medium placeholder-gray-600 focus:ring-0"
        style={{ 
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "100% 28px",
          lineHeight: "28px"
        }}
      />
    </div>
  );
};

export default NotesWidget;
