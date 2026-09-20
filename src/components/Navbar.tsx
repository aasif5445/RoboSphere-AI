import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  BookOpen, 
  Layers, 
  Upload, 
  Eye, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeSection?: string;
  setActiveSection?: (sec: string) => void;
  robotVisionActive?: boolean;
  setRobotVisionActive?: React.Dispatch<React.SetStateAction<boolean>>;
  visionMode?: boolean;
  onToggleVision?: () => void;
  isMuted?: boolean;
  setIsMuted?: (muted: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection = 'hero',
  setActiveSection,
  robotVisionActive,
  setRobotVisionActive,
  visionMode = false,
  onToggleVision,
  isMuted: propIsMuted,
  setIsMuted: propSetIsMuted,
}) => {
  const [internalMuted, setInternalMuted] = useState(false);
  const isMuted = propIsMuted !== undefined ? propIsMuted : internalMuted;
  const isVisionActive = visionMode || !!robotVisionActive;

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Compass },
    { id: 'chat', label: 'AI Assistant', icon: Bot, badge: 'RAG' },
    { id: 'playground', label: 'Playground', icon: Cpu, badge: 'Live' },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen },
    { id: 'upload', label: 'Upload Docs', icon: Upload },
    { id: 'telemetry', label: 'Telemetry', icon: Layers },
  ];

  const handleNavClick = (id: string) => {
    sound.playClick();
    if (setActiveSection) setActiveSection(id);
    setMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleVisionMode = () => {
    const next = !isVisionActive;
    sound.playVisionMode(next);
    if (onToggleVision) {
      onToggleVision();
    } else if (setRobotVisionActive) {
      setRobotVisionActive(next);
    }
  };

  const toggleSound = () => {
    const next = !isMuted;
    sound.setMuted(next);
    if (propSetIsMuted) propSetIsMuted(next);
    else setInternalMuted(next);
    if (!next) sound.playClick();
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2.5 bg-[#050505]/85 backdrop-blur-xl border-b border-red-500/20 shadow-[0_4px_30px_rgba(255,43,43,0.08)]' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          id="nav-logo"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff2b2b] to-[#700505] p-0.5 shadow-[0_0_15px_rgba(255,43,43,0.4)] group-hover:shadow-[0_0_25px_rgba(255,43,43,0.8)] transition-all">
            <div className="w-full h-full bg-[#080808] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#ff2b2b] group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-lg tracking-wider text-white">
                ROBOSPHERE<span className="text-[#ff2b2b]">.AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-red-950/60 text-red-400 border border-red-800/50 rounded">
                IEEE RAS
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono tracking-wide hidden sm:block">
              Robotics OS &amp; RAG Intelligence Layer
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0d0d0d]/80 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                onMouseEnter={() => sound.playHoverTick()}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive 
                    ? 'text-white bg-gradient-to-r from-[#ff2b2b]/90 to-[#b50000]/90 shadow-[0_0_15px_rgba(255,43,43,0.4)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/40 text-white' : 'bg-red-950 text-red-400 border border-red-800/40'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Vision Mode HUD & Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Robot Vision Mode Button */}
          <button
            id="robot-vision-toggle-btn"
            onClick={toggleVisionMode}
            onMouseEnter={() => sound.playHoverTick()}
            title="Toggle Robot Vision HUD Mode"
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs transition-all border ${
              robotVisionActive
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_20px_rgba(255,43,43,0.7)] animate-pulse'
                : 'bg-[#111111] text-gray-300 hover:text-white border-red-500/30 hover:border-red-500/70 hover:bg-red-950/30'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${robotVisionActive ? 'animate-spin' : 'text-red-500'}`} />
            <span className="hidden sm:inline">
              {robotVisionActive ? 'HUD ACTIVE' : 'VISION MODE'}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            id="audio-mute-toggle-btn"
            onClick={toggleSound}
            onMouseEnter={() => sound.playHoverTick()}
            title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio'}
            className="p-2 rounded-lg bg-[#111111] border border-white/10 text-gray-400 hover:text-white hover:border-red-500/40 transition-all"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#ff2b2b]" />
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#111111] border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-red-900/30 px-4 py-4 space-y-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-red-500" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-red-950 text-red-400 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
