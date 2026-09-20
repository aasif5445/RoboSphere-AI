import React, { useState } from 'react';
import { ShieldCheck, ChevronDown, ChevronUp, FileText, ExternalLink, Sparkles, Database } from 'lucide-react';
import { RAGExplanation } from '../types';
import { sound } from '../utils/audio';

interface RAGExplainabilityPanelProps {
  explanation: RAGExplanation;
}

export const RAGExplainabilityPanel: React.FC<RAGExplainabilityPanelProps> = ({ explanation }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeChunkIndex, setActiveChunkIndex] = useState(0);

  const toggleExpand = () => {
    sound.playClick();
    setExpanded(!expanded);
  };

  return (
    <div className="mt-3.5 border border-red-500/25 bg-[#0a0a0f]/90 rounded-xl overflow-hidden backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Summary Header */}
      <div 
        onClick={toggleExpand}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-red-950/20 transition-colors select-none"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-950/60 border border-red-500/40 rounded text-[11px] font-mono text-red-400">
            <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">VERIFIED RAG GROUNDING</span>
          </div>

          <div className="text-xs text-gray-300 font-mono flex items-center gap-2">
            <span>Overall Match:</span>
            <span className="text-red-400 font-bold">{explanation.confidence}%</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 text-[11px]">Indexed Corpus: {explanation.corpusDocCount} docs</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 text-[11px]">{explanation.searchTimeMs}ms latency</span>
          </div>
        </div>

        <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono">
          <span>{expanded ? 'Hide Proof' : 'View Citations & Chunks'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Sources Bar */}
      <div className="px-4 py-2 bg-black/40 border-t border-red-500/10 flex items-center gap-2 overflow-x-auto text-[11px] font-mono">
        <span className="text-gray-400 uppercase tracking-wider text-[10px] whitespace-nowrap">Sources Used:</span>
        {explanation.topSources.map((s, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-red-900/50 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-gray-200">{s.source}</span>
            <span className="text-red-400 font-bold ml-1">{s.confidence}%</span>
          </div>
        ))}
      </div>

      {/* Expanded Deep-Dive Panel: Exact Chunks Proof */}
      {expanded && (
        <div className="p-4 border-t border-red-500/20 bg-[#050508]/95 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-red-400" />
              <span className="uppercase text-[11px] font-bold text-gray-200">Retrieved Chunks &amp; Extracted Snippets</span>
            </div>
            <span className="text-[10px] text-gray-500">IEEE RAS Grounding Spec v3.2</span>
          </div>

          {/* Chunk Selector Tabs */}
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
            {explanation.chunks.map((chunk, idx) => (
              <button
                key={chunk.id}
                onClick={() => {
                  sound.playHoverTick();
                  setActiveChunkIndex(idx);
                }}
                className={`px-3 py-1 rounded text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeChunkIndex === idx
                    ? 'bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(255,43,43,0.5)]'
                    : 'bg-[#15151b] text-gray-400 hover:text-white hover:bg-[#202028]'
                }`}
              >
                <span>Chunk {idx + 1}</span>
                <span className="text-[10px] opacity-80 font-normal">({chunk.similarity}%)</span>
              </button>
            ))}
          </div>

          {/* Selected Chunk Content Card */}
          {explanation.chunks[activeChunkIndex] && (
            <div className="p-3.5 rounded-lg bg-black/60 border border-red-900/40 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="font-bold text-red-300 text-xs">
                    {explanation.chunks[activeChunkIndex].title}
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    Source: <strong className="text-gray-300">{explanation.chunks[activeChunkIndex].source}</strong>
                    {explanation.chunks[activeChunkIndex].page && (
                      <span className="ml-2 px-1.5 py-0.2 bg-red-950/80 rounded border border-red-800/40 text-[10px] text-red-400">
                        Page {explanation.chunks[activeChunkIndex].page}
                      </span>
                    )}
                    <span className="ml-2 px-1.5 py-0.2 bg-gray-900 rounded border border-gray-800 text-[10px] text-gray-400">
                      Category: {explanation.chunks[activeChunkIndex].category}
                    </span>
                  </p>
                </div>

                {explanation.chunks[activeChunkIndex].url && explanation.chunks[activeChunkIndex].url !== '#' && (
                  <a
                    href={explanation.chunks[activeChunkIndex].url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                    title="Open Source URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Exact Snippet Box */}
              <div className="p-2.5 rounded bg-[#09090e] border border-white/5 text-gray-300 text-[11px] leading-relaxed font-sans">
                <span className="font-mono text-red-500 font-bold mr-1">&ldquo;</span>
                {explanation.chunks[activeChunkIndex].snippet}
                <span className="font-mono text-red-500 font-bold ml-1">&rdquo;</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
