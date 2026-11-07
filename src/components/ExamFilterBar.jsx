import React from 'react';

export default function ExamFilterBar({ 
  selectedExam, 
  setSelectedExam, 
  selectedYear, 
  setSelectedYear,
  selectedSubject,
  setSelectedSubject 
}) {
  const exams = [
    { id: 'All', label: 'All Exams' },
    { id: 'JEE Main', label: 'JEE Main (10 Yrs)' },
    { id: 'JEE Advanced', label: 'JEE Advanced (10 Yrs)' },
    { id: 'ISC Class 12', label: 'ISC Class 12' }
  ];

  const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];

  const iscSubjects = [
    'All',
    'English Literature',
    'English Language',
    'Physical Education',
    'Computer Science',
    'Chemistry',
    'Physics'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2.5 my-2">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {exams.map((ex) => {
          const isActive = selectedExam === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => {
                setSelectedExam(ex.id);
                setSelectedYear('All');
                setSelectedSubject('All');
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isActive
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {ex.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters: Years for JEE or Subjects for ISC */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        {selectedExam === 'ISC Class 12' ? (
          <>
            <span className="text-[11px] text-slate-500 font-medium shrink-0 mr-1">Subject:</span>
            {iscSubjects.map((sub) => {
              const isActive = selectedSubject === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                    isActive
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-300 font-medium'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </>
        ) : (
          <>
            <span className="text-[11px] text-slate-500 font-medium shrink-0 mr-1">Year:</span>
            {years.map((yr) => {
              const isActive = selectedYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`shrink-0 px-2 py-0.5 rounded-lg text-[11px] border font-mono transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
