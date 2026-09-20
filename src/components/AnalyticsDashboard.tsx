import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Database, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Server,
  Terminal,
  Radio
} from 'lucide-react';
import { TELEMETRY_DATA } from '../data/roboticsCorpus';

export const AnalyticsDashboard: React.FC = () => {
  const [liveLatency, setLiveLatency] = useState(14.8);
  const [activeQueries, setActiveQueries] = useState(14820);
  const [memoryUsage, setMemoryUsage] = useState(64.2);

  // Live fluctuating telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveLatency(l => +(14 + (Math.random() - 0.5) * 2.4).toFixed(1));
      setActiveQueries(q => q + Math.floor(Math.random() * 3) - 1);
      setMemoryUsage(m => +(64 + (Math.random() - 0.5) * 1.5).toFixed(1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="telemetry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>IEEE RAS MISSION CONTROL ROOM</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
          Real-Time System Telemetry
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Live monitoring of vector retrieval accuracy, query latency, DDS buffer saturation, and corpus distribution.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* KPI 1: Latency */}
        <div className="p-4 rounded-xl bg-[#09090f] border border-red-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-2">
            <span>RAG SEARCH LATENCY</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{liveLatency}</span>
            <span className="text-xs font-mono text-red-400">ms</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-green-400 flex items-center gap-1">
            <span>↓ 4.2% faster than baseline</span>
          </div>
        </div>

        {/* KPI 2: Accuracy */}
        <div className="p-4 rounded-xl bg-[#09090f] border border-red-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-2">
            <span>GROUNDING ACCURACY</span>
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{TELEMETRY_DATA.groundingAccuracy}%</span>
            <span className="text-xs font-mono text-gray-400">precision</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-400">
            <span>0% hallucination rate</span>
          </div>
        </div>

        {/* KPI 3: Total Queries */}
        <div className="p-4 rounded-xl bg-[#09090f] border border-red-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-2">
            <span>PROCESSED INQUIRIES</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{activeQueries.toLocaleString()}</span>
            <span className="text-xs font-mono text-gray-400">queries</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-green-400">
            <span>↑ 18.5% weekly growth</span>
          </div>
        </div>

        {/* KPI 4: Nodes & Memory */}
        <div className="p-4 rounded-xl bg-[#09090f] border border-red-500/20 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono mb-2">
            <span>GPU VRAM / CACHE</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{memoryUsage}%</span>
            <span className="text-xs font-mono text-gray-400">16.0 GB</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-400">
            <span>TensorRT-LLM optimized</span>
          </div>
        </div>

      </div>

      {/* Main Mission Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Query Volume & Latency Trend (Custom SVG Chart) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0b0b12] border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h4 className="font-heading font-bold text-white text-sm">
                24-Hour Retrieval Volume &amp; Latency Spectrum
              </h4>
              <p className="text-xs text-gray-400 font-mono">Real-time throughput metrics across global IEEE RAS chapters</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-400 text-[10px] font-mono border border-red-800/40">
              STREAM: LIVE
            </span>
          </div>

          {/* SVG Bar / Line Chart */}
          <div className="h-56 relative w-full pt-4">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff2b2b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ff2b2b" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff3333" />
                  <stop offset="100%" stopColor="#ffaa44" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="40" x2="580" y2="40" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="90" x2="580" y2="90" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="140" x2="580" y2="140" stroke="rgba(255,255,255,0.06)" />
              <line x1="40" y1="180" x2="580" y2="180" stroke="rgba(255,255,255,0.15)" />

              {/* Bars for Queries */}
              {TELEMETRY_DATA.recentQueries.map((item, idx) => {
                const x = 60 + idx * 75;
                const h = (item.volume / 650) * 130;
                const y = 180 - h;
                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width="34"
                      height={h}
                      rx="4"
                      fill="url(#barGrad)"
                    />
                    <text
                      x={x + 17}
                      y="195"
                      textAnchor="middle"
                      fill="#777"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {item.time}
                    </text>
                    <text
                      x={x + 17}
                      y={y - 6}
                      textAnchor="middle"
                      fill="#ff6b6b"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {item.volume}
                    </text>
                  </g>
                );
              })}

              {/* Latency line */}
              <polyline
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2.5"
                points="77,130 152,110 227,118 302,95 377,88 452,102 527,80"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-t border-white/5 pt-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded" />
              <span>Query Volume (req/hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-amber-400" />
              <span>P99 Retrieval Latency (~14ms)</span>
            </div>
          </div>
        </div>

        {/* Right: Topic Distribution & Sensor Health */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Topic Distribution */}
          <div className="rounded-2xl bg-[#0b0b12] border border-white/10 p-5 shadow-xl space-y-3">
            <h4 className="font-heading font-bold text-white text-sm flex items-center justify-between">
              <span>Robotics Domain Popularity</span>
              <span className="text-gray-400 text-xs font-mono font-normal">Vector Frequency</span>
            </h4>

            <div className="space-y-2.5 pt-1 font-mono text-xs">
              {TELEMETRY_DATA.topicDistribution.map((t, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-gray-300 text-[11px]">
                    <span>{t.topic}</span>
                    <span className="text-red-400 font-bold">{t.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage}%`, backgroundColor: t.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health / Safety Watchdog */}
          <div className="rounded-2xl bg-black/60 border border-red-950 p-4 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-gray-300 font-bold text-[11px] border-b border-white/5 pb-1">
              <span className="flex items-center gap-1.5 text-red-400">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                SAFETY WATCHDOG: ARMED
              </span>
              <span className="text-green-400">ALL NOMINAL</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>ChromaDB Vector Shards:</span>
              <span className="text-white">4 Primary / 2 Replica</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>Embedding Engine:</span>
              <span className="text-white">all-MiniLM-L6-v2 (384-dim)</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>DDS Transport:</span>
              <span className="text-white">eProsima Fast DDS (SHM enabled)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
