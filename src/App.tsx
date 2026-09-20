import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RobotVisionHUD } from './components/RobotVisionHUD';
import { HeroSection } from './components/HeroSection';
import { AIChatSection } from './components/AIChatSection';
import { PlaygroundSection } from './components/PlaygroundSection';
import { KnowledgeExplorer } from './components/KnowledgeExplorer';
import { UploadSection } from './components/UploadSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { IEEEShowcase } from './components/IEEEShowcase';
import { Footer } from './components/Footer';

export default function App() {
  const [visionMode, setVisionMode] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string>('');

  const handleAskAI = (prompt?: string) => {
    if (prompt) {
      setInitialChatPrompt(prompt);
    }
    const chatEl = document.getElementById('chat');
    chatEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleVision = () => {
    setVisionMode((prev) => !prev);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-red-600 selection:text-white relative overflow-x-hidden ${
      visionMode ? 'robot-vision-active' : ''
    }`}>
      {/* Robot Vision Mode Tactical HUD Overlay */}
      <RobotVisionHUD
        active={visionMode}
        onClose={() => setVisionMode(false)}
      />

      {/* Top Fixed Navbar */}
      <Navbar
        visionMode={visionMode}
        onToggleVision={handleToggleVision}
      />

      {/* Main Flow Sections */}
      <main className="relative z-10">
        {/* 1. Futuristic 3D Hero Section */}
        <HeroSection
          onAskAI={handleAskAI}
          onToggleVisionHUD={handleToggleVision}
          visionMode={visionMode}
        />

        {/* 2. Grounded AI Chat Assistant Section */}
        <AIChatSection
          initialPrompt={initialChatPrompt}
          onClearInitialPrompt={() => setInitialChatPrompt('')}
        />

        {/* 3. Interactive Robotics Playground (SLAM, IK Arm, A* Search) */}
        <PlaygroundSection />

        {/* 4. Animated Knowledge Explorer Cards */}
        <KnowledgeExplorer onSelectQuestion={handleAskAI} />

        {/* 5. PDF & Technical Document Ingestion Engine */}
        <UploadSection onAskAboutDoc={handleAskAI} />

        {/* 6. Mission Control Real-Time Telemetry Dashboard */}
        <AnalyticsDashboard />

        {/* 7. IEEE RAS Showcase & Literature Grounding */}
        <IEEEShowcase />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
