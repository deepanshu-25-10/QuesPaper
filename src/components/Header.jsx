import React from 'react';
import { Zap, ShieldCheck, BookOpen, GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">QP Finder</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold tracking-wider">
                10-Year Archives & ISC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal">
              Official Papers • Final Answer Keys • Reputed Coaching & Council Solutions
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>ISC Class 12 (6 Subjects)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>JEE Main & Adv (10 Years)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Allen & CISCE Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}
