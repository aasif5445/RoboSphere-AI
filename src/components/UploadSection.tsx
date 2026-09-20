import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Database, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  AlertCircle,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { RoboticsDocument } from '../types';
import { INITIAL_INDEXED_DOCS } from '../data/roboticsCorpus';
import { sound } from '../utils/audio';

interface UploadSectionProps {
  onAskAboutDoc: (prompt: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAskAboutDoc }) => {
  const [documents, setDocuments] = useState<RoboticsDocument[]>(INITIAL_INDEXED_DOCS);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedDocName, setUploadedDocName] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<RoboticsDocument | null>(INITIAL_INDEXED_DOCS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    sound.playClick();
    setUploadedDocName(file.name);
    setUploadProgress(10);

    // Read file text
    const text = await file.text();

    // Animate progress
    let p = 15;
    const interval = setInterval(() => {
      p += 25;
      if (p >= 90) {
        clearInterval(interval);
      } else {
        setUploadProgress(p);
      }
    }, 150);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          content: text,
          category: 'Uploaded Document'
        })
      });

      clearInterval(interval);
      setUploadProgress(100);
      sound.playAiNotification();

      const newDoc: RoboticsDocument = {
        id: `user-doc-${Date.now()}`,
        name: file.name,
        source: 'User Uploaded Ingestion',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedAt: 'Just now',
        chunkCount: Math.max(12, Math.floor(file.size / 1500)),
        status: 'indexed',
        summary: `Custom document parsed and indexed into vector memory. Available for RAG search.`,
        category: 'Uploaded Manual'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);

      setTimeout(() => {
        setUploadProgress(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setUploadProgress(null);
    }
  };

  return (
    <section id="upload" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Database className="w-3.5 h-3.5" />
          <span>AUTONOMOUS DOCUMENT INGESTION PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
          Upload &amp; Index Robotics Manuals
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Feed custom hardware schematics, PDF manuals, or ROS packages directly into the RAG vector space.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Drag & Drop Zone */}
        <div className="lg:col-span-5 space-y-4">
          <div
            id="drag-and-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[340px] ${
              isDragging
                ? 'border-red-500 bg-red-950/30 shadow-[0_0_30px_rgba(255,43,43,0.4)] scale-102'
                : 'border-red-900/40 hover:border-red-500/70 bg-[#0c0c14]/80 hover:bg-[#11111c]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.json,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Glowing upload icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,43,43,0.5)] mb-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <h4 className="font-heading font-bold text-lg text-white">
              Drag &amp; Drop Technical PDF / Text
            </h4>
            <p className="mt-1 text-xs text-gray-400 font-sans max-w-xs">
              Supports IEEE RAS papers, ROS 2 URDF packages, DYNAMIXEL manuals, and robotics research notes.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-gray-400">
                PDF
              </span>
              <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-gray-400">
                TXT
              </span>
              <span className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-[10px] font-mono text-gray-400">
                MD / URDF
              </span>
            </div>

            {/* Upload Progress Bar Overlay */}
            {uploadProgress !== null && (
              <div className="absolute inset-0 rounded-2xl bg-black/90 backdrop-blur-md p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-xs font-mono text-gray-300">
                    <span>INDEXING: {uploadedDocName}</span>
                    <span className="text-red-400 font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300 shadow-[0_0_10px_rgba(255,43,43,0.8)]"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-center text-gray-400 animate-pulse">
                    Parsing sections • Generating embeddings • Building chunks
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Direct Sample PDF loader button */}
          <button
            onClick={() => {
              sound.playClick();
              processFile(new File([
                `IEEE RAS Technical Briefing 2026: Next-Generation Humanoid Actuators.
                Humanoid locomotion requires high torque density electric actuators such as quasi-direct-drive (QDD) planetary gearboxes and cycloidal pin drives. 
                Motor controllers operate at 1 kHz frequency executing field-oriented control (FOC) over EtherCAT fieldbuses.`
              ], 'Humanoid_QDD_Actuator_Spec.pdf', { type: 'application/pdf' }));
            }}
            className="w-full py-2.5 rounded-xl bg-[#14141e] hover:bg-[#1c1c28] border border-red-500/30 text-xs font-mono text-red-400 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample: Humanoid_QDD_Actuator_Spec.pdf</span>
          </button>
        </div>

        {/* Right: Indexed Corpus List & Document Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#0b0b12] border border-white/10 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-white">
                <FileCheck className="w-4 h-4 text-red-400" />
                <span>Currently Indexed Robotics Corpora</span>
              </div>
              <span className="text-[11px] font-mono text-green-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {documents.length} Documents Active
              </span>
            </div>

            {/* Document Cards List */}
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedDoc(doc);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-red-950/30 border-red-500/60 shadow-[0_0_15px_rgba(255,43,43,0.15)]'
                        : 'bg-[#12121c] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-black/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-200">{doc.name}</h5>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {doc.source} • {doc.chunkCount} chunks • {doc.size}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-gray-400 border border-white/5">
                        {doc.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Document Details & Quick Query CTA */}
            {selectedDoc && (
              <div className="p-4 rounded-xl bg-black/60 border border-red-900/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <span>DOCUMENT SUMMARY</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Ready for RAG
                  </span>
                </div>
                <p className="text-gray-300 font-sans text-xs leading-relaxed">
                  {selectedDoc.summary}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-gray-500 text-[11px]">Source page references enabled</span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onAskAboutDoc(`What are the key technical concepts described in ${selectedDoc.name}?`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,43,43,0.5)]"
                  >
                    <span>Ask AI About This Document</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
