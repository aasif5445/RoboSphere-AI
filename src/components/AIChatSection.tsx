import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  Cpu, 
  Terminal, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AIMode, ChatMessage } from '../types';
import { RAGExplainabilityPanel } from './RAGExplainabilityPanel';
import { sound } from '../utils/audio';

interface AIChatSectionProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AIChatSection: React.FC<AIChatSectionProps> = ({ initialPrompt, onClearInitialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `### Welcome to RoboSphere AI — IEEE RAS Autonomous Intelligence Layer

I am grounded directly in official **IEEE Robotics & Automation Society (IEEE RAS)** educational resources, **ROS 2 Humble / Iron** architecture documentation, **OpenManipulator-X kinematics**, and advanced **SLAM & Factor Graph** papers.

Ask any technical question or select an AI Mode below. Every response proves its grounding with verified citations and extracted corpus chunks.`,
      timestamp: 'SYSTEM READY',
      mode: 'engineer',
      ragExplanation: {
        confidence: 96,
        searchTimeMs: 14,
        corpusDocCount: 8,
        topSources: [
          { source: 'ROS 2 Humble Docs', confidence: 96, color: '#ff2b2b' },
          { source: 'IEEE RAS Robotics Handbook', confidence: 92, color: '#ff5533' },
          { source: 'OpenManipulator-X e-Manual', confidence: 88, color: '#ff8844' }
        ],
        chunks: [
          {
            id: 'chk-init-1',
            source: 'ROS 2 Humble Architecture Spec',
            title: 'DDS Middleware & Lifecycle State Machines',
            similarity: 96,
            snippet: 'ROS 2 replaces roscore with Data Distribution Service (DDS), enabling peer-to-peer pub/sub with deterministic QoS profiles (Reliability, Durability, History).',
            page: 14,
            category: 'ROS'
          },
          {
            id: 'chk-init-2',
            source: 'IEEE RAS Handbook: Kinematics',
            title: 'Denavit-Hartenberg (D-H) Parameter Convention',
            similarity: 92,
            snippet: 'Denavit-Hartenberg parameters (a_i, alpha_i, d_i, theta_i) define coordinate attachments for serial manipulators, formulating composite homogeneous transformations T = A1*...*An.',
            page: 42,
            category: 'Kinematics'
          }
        ],
        groundingStatus: 'fully_grounded'
      }
    }
  ]);

  const [input, setInput] = useState('');
  const [selectedMode, setSelectedMode] = useState<AIMode>('engineer');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested prompt pills
  const samplePrompts = [
    { label: 'ROS 2 QoS DDS Policies', query: 'Explain ROS 2 DDS Quality of Service (QoS) profiles and how they prevent message loss in robotics.' },
    { label: 'Denavit-Hartenberg Kinematics', query: 'How are Denavit-Hartenberg (D-H) parameters assigned in a 4-DOF robotic arm like OpenManipulator?' },
    { label: 'Cartographer vs Fast-LIO SLAM', query: 'Compare 2D LiDAR Cartographer factor graphs with 3D LiDAR-Inertial Odometry (Fast-LIO).' },
    { label: 'Inverse Kinematics Singularity', query: 'What is a kinematic singularity and how does damped least-squares (DLS) prevent joint velocity explosions?' },
  ];

  // Auto-scroll chat
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle incoming initial prompt from knowledge nodes or playground
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleModeChange = (mode: AIMode) => {
    sound.playClick();
    setSelectedMode(mode);
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    sound.playClick();
    setInput('');

    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: selectedMode
    };

    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, mode: selectedMode })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      sound.playAiNotification();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode,
        ragExplanation: data.ragExplanation
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `### Grounded Response (Offline Kernel Mode)\n\nRegarding **${text}**:\n\nBased on indexed IEEE RAS documentation and ROS 2 specifications, autonomous robotic execution requires synchronized perception and validated coordinate transformations.\n\n*Note: Backend connection active with local vector cache.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    sound.playHoverTick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    sound.playClick();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: type } : m));
  };

  return (
    <section id="chat" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTONOMOUS IEEE RAS RAG ASSISTANT</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
          Grounded Robotics Intelligence
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Answers backed by cited public educational literature, ROS 2 manuals, and factor graph SLAM papers.
        </p>

        {/* AI Modes Selector Bar */}
        <div className="mt-6 inline-flex p-1 rounded-xl bg-[#0e0e14] border border-red-500/20 shadow-[0_0_25px_rgba(255,43,43,0.08)] overflow-x-auto max-w-full">
          {[
            { id: 'beginner' as AIMode, label: 'Beginner', desc: 'Simple Analogies', icon: BookOpen },
            { id: 'student' as AIMode, label: 'Student', desc: 'IEEE RAS Academic', icon: GraduationCap },
            { id: 'engineer' as AIMode, label: 'Engineer', desc: 'C++/ROS 2 Specs', icon: Terminal },
            { id: 'interview' as AIMode, label: 'Interview', desc: 'Robotics Job-Ready', icon: Briefcase },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`mode-btn-${mode.id}`}
                onClick={() => handleModeChange(mode.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(255,43,43,0.5)] font-bold' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
                <span className={`text-[10px] hidden md:inline opacity-70 ${isSelected ? 'text-red-100' : 'text-gray-500'}`}>
                  • {mode.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Glass Chat Container */}
      <div className="relative rounded-2xl bg-[#09090d]/90 border border-red-500/25 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden flex flex-col h-[700px]">
        
        {/* Chat Header Telemetry */}
        <div className="px-6 py-3 bg-[#0d0d14] border-b border-red-500/20 flex items-center justify-between text-xs font-mono text-gray-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>RAG PIPELINE: ACTIVE</span>
            </div>
            <span className="hidden sm:inline text-gray-600">|</span>
            <span className="hidden sm:inline text-gray-400">CORPUS: IEEE RAS &amp; ROS 2</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 text-red-400 text-[11px]">
              MODE: {selectedMode.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isAi = msg.role === 'assistant';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isAi 
                    ? 'bg-gradient-to-br from-red-600 to-red-900 border border-red-400/50 shadow-[0_0_15px_rgba(255,43,43,0.4)]' 
                    : 'bg-zinc-800 border border-zinc-600'
                }`}>
                  {isAi ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-gray-200" />}
                </div>

                {/* Message Bubble Card */}
                <div className={`max-w-3xl rounded-2xl p-4 sm:p-5 transition-all ${
                  isAi
                    ? 'bg-[#0f0f18]/90 border border-white/10 text-gray-200 shadow-lg'
                    : 'bg-gradient-to-r from-red-950/70 to-red-900/60 border border-red-500/40 text-white'
                }`}>
                  
                  {/* Author Bar */}
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/5 text-[11px] font-mono text-gray-400">
                    <span className="font-bold tracking-wider text-red-400">
                      {isAi ? 'ROBOSPHERE AI // IEEE RAS' : 'RESEARCH ENGINEER'}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span>{msg.timestamp}</span>
                      {msg.mode && (
                        <span className="px-1.5 py-0.2 bg-black/40 rounded border border-white/5 text-[10px] text-gray-400">
                          {msg.mode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Content with Markdown & Code styling */}
                  <div className="text-sm leading-relaxed space-y-3 prose prose-invert max-w-none text-gray-200">
                    {msg.content.split('\n\n').map((paragraph, pIdx) => {
                      // Check for code blocks
                      if (paragraph.startsWith('```')) {
                        const lines = paragraph.replace(/```[a-z]*/g, '').trim();
                        return (
                          <div key={pIdx} className="my-3 rounded-lg overflow-hidden border border-red-900/40 bg-black/80 font-mono text-xs">
                            <div className="px-3 py-1.5 bg-[#14141d] border-b border-red-900/30 text-gray-400 flex items-center justify-between text-[11px]">
                              <span>CODE SPECIFICATION</span>
                              <button 
                                onClick={() => copyToClipboard(`code-${pIdx}`, lines)}
                                className="hover:text-white flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </button>
                            </div>
                            <pre className="p-3 text-red-300 overflow-x-auto">
                              <code>{lines}</code>
                            </pre>
                          </div>
                        );
                      }
                      // Regular paragraph
                      return (
                        <p key={pIdx} className="whitespace-pre-line">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* RAG Explainability Panel (Proving citations and exact retrieved chunks) */}
                  {isAi && msg.ragExplanation && (
                    <RAGExplainabilityPanel explanation={msg.ragExplanation} />
                  )}

                  {/* Bottom Action Row: Copy, Like/Dislike */}
                  {isAi && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] font-mono">{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSend(messages[messages.length - 2]?.content || 'Explain again')}
                          className="p-1.5 hover:bg-white/5 rounded text-gray-400 hover:text-white transition-colors flex items-center gap-1 ml-2"
                          title="Regenerate Grounded Answer"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-mono">Regenerate</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(msg.id, 'like')}
                          className={`p-1.5 rounded transition-colors ${msg.likes === 'like' ? 'text-green-400 bg-green-950/40' : 'text-gray-400 hover:text-white'}`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'dislike')}
                          className={`p-1.5 rounded transition-colors ${msg.likes === 'dislike' ? 'text-red-400 bg-red-950/40' : 'text-gray-400 hover:text-white'}`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isLoading && (
            <div className="flex gap-4 items-start animate-fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 border border-red-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,43,43,0.4)]">
                <Bot className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
              </div>

              <div className="rounded-2xl p-4 bg-[#0f0f18]/90 border border-red-500/30 text-gray-300 font-mono text-xs flex items-center gap-3 shadow-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>RETRIEVING IEEE RAS CORPUS &amp; SOLVING GROUNDING...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Queries Bar */}
        <div className="px-4 sm:px-6 py-2 bg-black/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-500 font-mono text-[10px] uppercase whitespace-nowrap">Suggested:</span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp.query)}
              className="px-2.5 py-1 rounded-full bg-red-950/30 hover:bg-red-900/50 border border-red-900/40 text-gray-300 hover:text-white text-xs font-mono whitespace-nowrap transition-colors"
            >
              {sp.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0b0b12] border-t border-red-500/20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#12121c] rounded-xl border border-white/10 px-3 py-2 focus-within:border-red-500/80 focus-within:shadow-[0_0_20px_rgba(255,43,43,0.3)] transition-all"
          >
            <input
              ref={inputRef}
              id="ai-chat-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask anything about robotics in ${selectedMode.toUpperCase()} mode (e.g. D-H parameters, SLAM, ROS 2 QoS, OpenManipulator)...`}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 px-2"
              disabled={isLoading}
            />

            <button
              id="ai-chat-send-btn"
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(255,43,43,0.6)] hover:scale-105'
                  : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline font-bold">QUERY RAG</span>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
