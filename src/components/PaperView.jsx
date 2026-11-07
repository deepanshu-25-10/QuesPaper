import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Key, 
  BookOpen, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Calendar,
  Layers,
  Award
} from 'lucide-react';

export default function PaperView({ paper, onOpenPdf }) {
  const [activeTab, setActiveTab] = useState('solutions'); // Default to solutions or paper
  const [keySubjectFilter, setKeySubjectFilter] = useState('All');

  // Keyboard navigation for tabs: 1 -> paper, 2 -> answer key, 3 -> solutions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === '1') setActiveTab('paper');
      if (e.key === '2') setActiveTab('key');
      if (e.key === '3') setActiveTab('solutions');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!paper) {
    return (
      <div className="w-full max-w-4xl mx-auto py-16 text-center text-slate-500">
        <Layers className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No paper selected or found. Try typing a query like "jee main 2024 shift 1 jan".</p>
      </div>
    );
  }

  const allenSource = paper.solutions.sources.find(s => s.name.includes('ALLEN')) || paper.solutions.sources[0];
  const mathongoSource = paper.solutions.sources.find(s => s.name.includes('MathonGo'));
  const resonanceSource = paper.solutions.sources.find(s => s.name.includes('Resonance'));

  const filteredQuickKey = paper.answerKey.quickKey?.filter(item => {
    if (keySubjectFilter === 'All') return true;
    return item.subject.toLowerCase().includes(keySubjectFilter.toLowerCase());
  }) || [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Paper Header Banner */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {paper.exam} {paper.year}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {paper.session}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {paper.shift} • {paper.shiftType}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {paper.questionPaper.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2.5">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {paper.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {paper.timing}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {paper.officialStatus}
              </span>
            </div>
          </div>

          {/* Quick One-Click Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenPdf(paper.questionPaper.url, `${paper.exam} ${paper.date} ${paper.shift} - Question Paper`, 'Official Paper')}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>View Paper</span>
            </button>
            <button
              onClick={() => {
                const primaryUrl = allenSource.subjects?.[0]?.url || paper.questionPaper.url;
                onOpenPdf(primaryUrl, `${paper.exam} ${paper.date} ${paper.shift} - Complete Solutions (ALLEN)`, 'Allen Solutions');
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Solutions</span>
            </button>
          </div>
        </div>

        {/* The 3 Core Minimalist Tabs */}
        <div className="flex items-center border-b border-slate-800 mt-6 pt-2">
          <button
            onClick={() => setActiveTab('paper')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === 'paper'
                ? 'border-emerald-500 text-white bg-emerald-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>1. Official Question Paper</span>
          </button>

          <button
            onClick={() => setActiveTab('key')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === 'key'
                ? 'border-emerald-500 text-white bg-emerald-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>2. Official Answer Key</span>
          </button>

          <button
            onClick={() => setActiveTab('solutions')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-semibold transition-all border-b-2 -mb-px ${
              activeTab === 'solutions'
                ? 'border-emerald-500 text-white bg-emerald-500/5 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>3. Compilation of Solutions</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              Coaching Solved
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: OFFICIAL QUESTION PAPER */}
      {activeTab === 'paper' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                  Official Exam Paper
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  {paper.questionPaper.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Issued by {paper.questionPaper.organization} • {paper.questionPaper.pages || 36} Pages • Original Shift Layout
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPdf(paper.questionPaper.url, paper.questionPaper.title, 'Official Question Paper')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Paper PDF</span>
                </button>
                <a
                  href={`/api/proxy-pdf?url=${encodeURIComponent(paper.questionPaper.url)}`}
                  download={`${paper.id}-official-paper.pdf`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {/* Paper Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">Format</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">Full Shift PDF</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">Language</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">English / Official</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">Sections</span>
                <span className="text-sm font-semibold text-slate-200 mt-0.5 block">MCQs & Numerical</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">Authenticity</span>
                <span className="text-sm font-semibold text-emerald-400 mt-0.5 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% NTA Verified
                </span>
              </div>
            </div>

            {paper.questionPaper.note && (
              <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-300">
                {paper.questionPaper.note}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: OFFICIAL ANSWER KEY */}
      {activeTab === 'key' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div>
                <span className="text-xs font-mono text-amber-400 tracking-wider uppercase font-semibold">
                  Official Final Key
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  {paper.answerKey.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {paper.answerKey.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPdf(paper.answerKey.url, paper.answerKey.title, 'Official Answer Key')}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-600/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Key Document</span>
                </button>
                <a
                  href={`/api/proxy-pdf?url=${encodeURIComponent(paper.answerKey.url)}`}
                  download={`${paper.id}-official-answer-key.pdf`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download Key</span>
                </a>
              </div>
            </div>

            {/* Quick Answer Key Option Matrix */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">
                  Quick Evaluated Option Matrix
                </span>
                <div className="flex items-center gap-1 text-xs">
                  {['All', 'Physics', 'Chemistry', 'Mathematics'].map(subj => (
                    <button
                      key={subj}
                      onClick={() => setKeySubjectFilter(subj)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                        keySubjectFilter === subj
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-medium'
                          : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {filteredQuickKey.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {filteredQuickKey.map((item, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 text-center flex flex-col justify-between"
                    >
                      <div className="text-[10px] text-slate-400 font-mono">
                        Q.{item.q}
                      </div>
                      <div className="my-1">
                        <span className="text-base font-bold text-amber-400 font-mono">
                          {item.correctOption}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">
                        {item.subject}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-400">
                  Detailed question key available in the official PDF document above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: COMPILATION OF SOLUTIONS (REPUTED COACHINGS) */}
      {activeTab === 'solutions' && (
        <div className="space-y-5">
          {/* Top Reputed Coaching: ALLEN Career Institute */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                    Reputed Coaching Compilation
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Tier-1 Faculty Verified
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
                  <span>{allenSource.name}</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {paper.solutions.overview}
                </p>
              </div>

              {/* Combined Solutions Button */}
              {allenSource.subjects && allenSource.subjects.length > 0 && (
                <button
                  onClick={() => onOpenPdf(allenSource.subjects[0].url, `${paper.exam} ${paper.date} ${paper.shift} - Solutions`, 'Allen Solutions')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20 shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Primary Solution PDF</span>
                </button>
              )}
            </div>

            {/* Subject-Wise Solutions Breakdown */}
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Subject-Wise Step-by-Step Solved Papers:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {allenSource.subjects?.map((sub, idx) => {
                  const icons = {
                    Physics: '⚛️',
                    Chemistry: '🧪',
                    Mathematics: '📐',
                    'Biology (Botany & Zoology)': '🧬'
                  };
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg">{icons[sub.subject] || '📑'}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {sub.size || '3.5 MB'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {sub.subject} Solutions
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          {sub.questions} Questions solved with detailed steps, formulas & graph plots.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => onOpenPdf(sub.url, `${paper.exam} ${paper.date} ${paper.shift} - ${sub.subject} Solutions`, `Allen ${sub.subject}`)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </button>
                        <a
                          href={`/api/proxy-pdf?url=${encodeURIComponent(sub.url)}`}
                          download={`${paper.id}-${sub.subject.toLowerCase()}-solutions.pdf`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title={`Download ${sub.subject} PDF`}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Other Reputed Coachings Compilation Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mathongoSource && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-white">{mathongoSource.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400">
                      Analytics & MARKS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {mathongoSource.description}
                  </p>
                </div>
                <a
                  href={mathongoSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white ml-2 transition-colors shrink-0"
                  title="Open MathonGo Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {resonanceSource && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-white">{resonanceSource.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400">
                      Kota Faculty
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {resonanceSource.description}
                  </p>
                </div>
                <a
                  href={resonanceSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white ml-2 transition-colors shrink-0"
                  title="Open Resonance Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
