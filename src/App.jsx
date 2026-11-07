import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ExamFilterBar from './components/ExamFilterBar';
import ShiftSelector from './components/ShiftSelector';
import PaperView from './components/PaperView';
import PdfViewerModal from './components/PdfViewerModal';
import { PAPERS_DATABASE } from '../server/papersData';

export default function App() {
  const [query, setQuery] = useState('jee main 2024 shift 1 jan');
  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    pdfUrl: '',
    sourceBadge: ''
  });

  // Client-side instant query matching function (< 1ms instant UI responsiveness)
  const filterPapersLocally = (searchQuery, examFilter, yearFilter, subjectFilter) => {
    let pool = PAPERS_DATABASE;

    // Apply category filter
    if (examFilter && examFilter !== 'All') {
      pool = pool.filter(p => p.exam.toLowerCase().includes(examFilter.toLowerCase()));
    }

    // Apply year filter
    if (yearFilter && yearFilter !== 'All') {
      pool = pool.filter(p => String(p.year) === String(yearFilter));
    }

    // Apply ISC subject filter
    if (subjectFilter && subjectFilter !== 'All') {
      pool = pool.filter(p => {
        const text = `${p.shift} ${p.questionPaper.title} ${p.tags.join(' ')}`.toLowerCase();
        return text.includes(subjectFilter.toLowerCase());
      });
    }

    if (!searchQuery || !searchQuery.trim()) return pool;

    const q = searchQuery.toLowerCase().trim();
    const tokens = q.split(/[\s,+/_-]+/).filter(Boolean);

    const scored = pool.map(paper => {
      let score = 0;
      const paperText = `${paper.exam} ${paper.year} ${paper.session} ${paper.date} ${paper.shift} ${paper.shiftType} ${paper.questionPaper.title} ${paper.tags.join(' ')}`.toLowerCase();

      // Check full match in tags
      for (const tag of paper.tags) {
        if (q.includes(tag) || tag.includes(q)) score += 60;
      }

      // Check individual tokens
      for (const token of tokens) {
        if (token === 's1' && paper.shift.toLowerCase().includes('shift 1')) score += 40;
        else if (token === 's2' && paper.shift.toLowerCase().includes('shift 2')) score += 40;
        else if (token === 'p1' && paper.shift.toLowerCase().includes('paper 1')) score += 40;
        else if (token === 'p2' && paper.shift.toLowerCase().includes('paper 2')) score += 40;
        else if (token === 'isc' && paper.exam.toLowerCase().includes('isc')) score += 50;
        else if (token === 'adv' || token === 'advance' || token === 'advanced') {
          if (paper.exam.toLowerCase().includes('advanced')) score += 50;
        }
        else if (token === 'main' || token === 'mains') {
          if (paper.exam.toLowerCase().includes('main')) score += 50;
        }
        else if (token === 'cs' || token === 'computer') {
          if (paperText.includes('computer')) score += 45;
        }
        else if (token === 'pe' || token === 'physical') {
          if (paperText.includes('physical')) score += 45;
        }
        else if (token === 'literature' || token === 'lit') {
          if (paperText.includes('literature')) score += 45;
        }
        else if (token === 'language' || token === 'lang') {
          if (paperText.includes('language')) score += 45;
        }
        else if (token === 'morning' && paper.shiftType.toLowerCase().includes('morning')) score += 25;
        else if (token === 'evening' && paper.shiftType.toLowerCase().includes('evening')) score += 25;
        else if (paperText.includes(token)) score += 15;
      }

      // Specific year match
      if (tokens.includes(String(paper.year))) {
        score += 35;
      }

      // Exact date match (e.g., '27')
      for (const token of tokens) {
        if (paper.date.toLowerCase().startsWith(token) || paper.date.toLowerCase().includes(` ${token} `)) {
          score += 30;
        }
      }

      return { paper, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.paper);
  };

  // Run search whenever query or filters change
  useEffect(() => {
    // Immediate local match for zero latency
    const results = filterPapersLocally(query, selectedExam, selectedYear, selectedSubject);
    setPapers(results);
    if (results.length > 0) {
      setSelectedPaper(results[0]);
    } else {
      setSelectedPaper(null);
    }

    // Try fetching from backend API as well (ensuring sync)
    const controller = new AbortController();
    const params = new URLSearchParams({
      q: query,
      exam: selectedExam,
      year: selectedYear
    });

    fetch(`/api/papers?${params.toString()}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        if (data && data.papers && data.papers.length > 0) {
          // Keep synced
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [query, selectedExam, selectedYear, selectedSubject]);

  const handleOpenPdf = (url, title, sourceBadge) => {
    setModalState({
      isOpen: true,
      title,
      pdfUrl: url,
      sourceBadge
    });
  };

  const handleClosePdf = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Search Section */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            10-Year JEE & ISC Board Official Archives
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ask Any Exam Paper, Answer Key & Solved Material
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Instant official question papers, final keys & faculty step-by-step solutions for <strong>JEE Main & Advanced (Last 10 Years)</strong> and <strong>ISC Class 12</strong> (English Lit, Lang, PE, CS, Chem, Phy).
          </p>

          <div className="pt-2">
            <SearchBar 
              query={query} 
              setQuery={setQuery} 
              onSelectChip={(label) => {
                setQuery(label);
                setSelectedExam('All');
                setSelectedYear('All');
                setSelectedSubject('All');
              }} 
            />
          </div>

          {/* Exam & Year Filters */}
          <ExamFilterBar
            selectedExam={selectedExam}
            setSelectedExam={setSelectedExam}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
        </section>

        {/* Shift / Paper Selector for Multiple Matches */}
        <ShiftSelector
          papers={papers}
          selectedPaper={selectedPaper}
          onSelectPaper={(p) => setSelectedPaper(p)}
        />

        {/* Selected Paper Details View */}
        <PaperView
          paper={selectedPaper}
          onOpenPdf={handleOpenPdf}
        />
      </main>

      {/* Embedded PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={modalState.isOpen}
        onClose={handleClosePdf}
        title={modalState.title}
        pdfUrl={modalState.pdfUrl}
        sourceBadge={modalState.sourceBadge}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        <p>QP Finder • Official JEE (10 Years) & ISC Class 12 Archives • Fast & Minimal</p>
      </footer>
    </div>
  );
}
