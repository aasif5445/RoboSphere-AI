import React from 'react';
import { Cpu, Github, ExternalLink, Heart, Radio, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-red-500/20 bg-[#050508] py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & IEEE statement */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-white tracking-wider text-sm">ROBOSPHERE AI</span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/40">v3.4 PRODUCTION</span>
          </div>
          <p className="text-[11px] text-gray-400 font-sans max-w-md">
            Grounded AI Assistant for the IEEE Robotics and Automation Society (IEEE RAS). Empowering students and engineers with verified robotics knowledge.
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[11px]">
          <a
            href="https://www.ieee-ras.org/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <span>IEEE RAS Official</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://docs.ros.org/en/humble/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <span>ROS 2 Humble</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="#chat"
            onClick={() => sound.playClick()}
            className="hover:text-red-400 transition-colors"
          >
            <span>Ask AI</span>
          </a>
          <a
            href="#playground"
            onClick={() => sound.playClick()}
            className="hover:text-red-400 transition-colors"
          >
            <span>Simulators</span>
          </a>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-300">DDS QOS: RELIABLE</span>
          <span className="text-gray-600">|</span>
          <span className="text-red-400 font-bold">100% GROUNDED</span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-[10px] text-gray-400">
        &copy; {new Date().getFullYear()} RoboSphere AI. Built with precision for the IEEE Robotics and Automation Society competition.
      </div>
    </footer>
  );
};
