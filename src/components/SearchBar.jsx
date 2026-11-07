import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

export default function SearchBar({ query, setQuery, onSelectChip }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const chips = [
    { label: "jee main 2024 shift 1 jan", icon: "🔥" },
    { label: "jee advanced 2024 paper 1", icon: "🎯" },
    { label: "isc 2024 physics", icon: "⚛️" },
    { label: "isc 2024 english literature", icon: "📖" },
    { label: "isc 2024 computer science", icon: "💻" },
    { label: "isc 2024 physical education", icon: "🏃" },
    { label: "isc 2024 chemistry", icon: "🧪" },
    { label: "jee main 2020 shift 1", icon: "📑" },
    { label: "jee advanced 2018 paper 1", icon: "📜" },
    { label: "jee main 2015 offline", icon: "🏛️" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask paper... e.g. 'jee main 2024 shift 1 jan', 'isc 2024 physics', 'jee adv 2018'..."
          className="w-full pl-11 pr-24 py-3.5 bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 focus:border-emerald-500/80 rounded-xl text-slate-100 placeholder-slate-500 shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm md:text-base transition-all"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-sm">
            /
          </kbd>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs scrollbar-none">
        <span className="text-slate-500 flex items-center gap-1 text-[11px] shrink-0 font-medium mr-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Quick:
        </span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelectChip(chip.label)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1"
          >
            <span>{chip.icon}</span>
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
