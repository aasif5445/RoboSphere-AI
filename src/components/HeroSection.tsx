import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Eye, Terminal, Play, Cpu, Compass } from 'lucide-react';
import { HeroCanvas } from './HeroCanvas';
import { sound } from '../utils/audio';

interface HeroSectionProps {
  onAskAI: (prompt?: string) => void;
  onToggleVisionHUD: () => void;
  visionMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAskAI,
  onToggleVisionHUD,
  visionMode
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
      
      {/* 3D Three.js Scene in the Background & Midground */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas onNodeClick={(question) => onAskAI(question)} />
      </div>

      {/* Subtle Radial Vignette Gradient so text is crisp */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.75)_100%)] pointer-events-none z-10" />

      {/* Main Content Overlay */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 select-none">
        
        {/* Top IEEE RAS Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/70 border border-red-500/40 text-red-300 text-xs font-mono mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,43,43,0.3)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold tracking-wider">IEEE ROBOTICS &amp; AUTOMATION SOCIETY (IEEE RAS)</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">RAG AI ASSISTANT</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] uppercase">
          Autonomous <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-rose-300 drop-shadow-[0_0_35px_rgba(255,43,43,0.6)]">
            Robotics Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed">
          The official-grade RAG assistant grounded in <strong className="text-white">IEEE RAS literature</strong>, <strong className="text-white">ROS 2 Humble</strong>, kinematics algorithms, and factor graph SLAM papers.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              const el = document.getElementById('chat');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 text-white font-heading font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,43,43,0.6)] hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>ASK ROBOSPHERE AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              const el = document.getElementById('playground');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#12121c]/90 hover:bg-[#1a1a28] border border-white/15 hover:border-red-500/50 text-gray-200 hover:text-white font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all backdrop-blur-md"
          >
            <Play className="w-3.5 h-3.5 text-red-400" />
            <span>LAUNCH 3D SIMULATORS</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleVisionHUD();
            }}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all backdrop-blur-md ${
              visionMode
                ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_25px_rgba(255,43,43,0.6)]'
                : 'bg-black/50 border-red-900/50 text-red-400 hover:border-red-500/80 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{visionMode ? 'DISABLE HUD' : 'ROBOT VISION MODE'}</span>
          </button>
        </div>

        {/* Feature Highlights / Stats Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-left">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] text-gray-400 block">GROUNDING QUALITY</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" /> 100% CITED
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] text-gray-400 block">AVERAGE LATENCY</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Terminal className="w-3.5 h-3.5 text-green-400" /> &lt; 15ms RAG
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] text-gray-400 block">SIMULATION ENGINES</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> SLAM &amp; IK
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] text-gray-400 block">INDEXED LITERATURE</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-red-400" /> IEEE RAS &amp; ROS
            </span>
          </div>
        </div>

      </div>

    </section>
  );
};
