import React from 'react';
import { Check } from 'lucide-react';

export default function ShiftSelector({ papers, selectedPaper, onSelectPaper }) {
  if (!papers || papers.length <= 1) return null;

  return (
    <div className="w-full max-w-4xl mx-auto my-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400">
          Matched Papers ({papers.length})
        </span>
        <span className="text-[11px] text-slate-500">
          Click any paper to view its official paper, key & solutions
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {papers.map((paper) => {
          const isSelected = selectedPaper?.id === paper.id;
          return (
            <button
              key={paper.id}
              onClick={() => onSelectPaper(paper)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    {paper.year}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded truncate max-w-[140px] ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {paper.shift}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-400">{paper.exam}</span>
                  <span>•</span>
                  <span>{paper.date}</span>
                </div>
              </div>

              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 ml-1">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
