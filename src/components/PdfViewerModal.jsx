import React, { useState } from 'react';
import { X, Download, ExternalLink, Maximize2, Minimize2, Loader2, RefreshCw } from 'lucide-react';

export default function PdfViewerModal({ isOpen, onClose, title, pdfUrl, sourceBadge }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen || !pdfUrl) return null;

  // Use the proxy endpoint to avoid CORS and X-Frame-Options blocking
  const proxyUrl = `/api/proxy-pdf?url=${encodeURIComponent(pdfUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div 
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl flex flex-col shadow-2xl transition-all overflow-hidden ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[88vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              {sourceBadge || 'PDF Document'}
            </span>
            <h3 className="text-sm font-semibold text-slate-100 truncate">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct Download */}
            <a
              href={proxyUrl}
              download={`${title || 'paper'}.pdf`}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs px-2.5 bg-slate-800/80 border border-slate-700"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Download</span>
            </a>

            {/* Open in new tab */}
            <a
              href={proxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open in new window"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Toggle Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF Frame */}
        <div className="relative flex-1 bg-slate-950 w-full h-full overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <span className="text-xs font-medium">Streaming high-res PDF...</span>
            </div>
          )}

          <iframe
            src={`${proxyUrl}#toolbar=1&navpanes=0`}
            title={title}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
