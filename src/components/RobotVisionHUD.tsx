import React, { useEffect, useState } from 'react';
import { Eye, Crosshair, ShieldAlert, Cpu, Activity, Zap, Compass, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface RobotVisionHUDProps {
  active: boolean;
  onClose: () => void;
}

export const RobotVisionHUD: React.FC<RobotVisionHUDProps> = ({ active, onClose }) => {
  const [pitch, setPitch] = useState(-2.4);
  const [yaw, setYaw] = useState(148.2);
  const [battery, setBattery] = useState(98.6);
  const [detectedTargets, setDetectedTargets] = useState([
    { id: 'T-01', label: 'ACTUATOR_XM430_J1', confidence: 99.4, pos: { top: '32%', left: '22%' }, status: 'CALIBRATED' },
    { id: 'T-02', label: 'ORB_FUSION_CORE', confidence: 97.8, pos: { top: '38%', right: '24%' }, status: '42°C [OPTIMAL]' },
    { id: 'T-03', label: 'LIDAR_POINTCLOUD_2D', confidence: 95.1, pos: { bottom: '26%', left: '44%' }, status: 'SCAN_RATE 20Hz' },
  ]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPitch(p => +(p + (Math.random() - 0.5) * 0.4).toFixed(1));
      setYaw(y => +(y + (Math.random() - 0.5) * 0.8).toFixed(1));
      setBattery(b => +(Math.max(90, b - 0.01)).toFixed(2));
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden select-none font-mono">
      {/* Top Banner Telemetry Bar */}
      <div className="absolute top-16 left-0 right-0 px-6 py-2 flex items-center justify-between text-[11px] text-red-500 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 border border-red-500/40 bg-red-950/40 rounded">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold text-red-400">ROBOT_HUD_ACTIVE // CAM_01 [RGB-D]</span>
          </div>
          <span className="hidden sm:inline text-red-400/80">LATENCY: 4.2ms</span>
          <span className="hidden md:inline text-red-400/80">RESOLUTION: 1920x1080@60FPS</span>
          <span className="text-red-400/80">YAW: {yaw}° | PITCH: {pitch}°</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-red-400">
            <Zap className="w-3.5 h-3.5" />
            <span>{battery}% [48.2V]</span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="pointer-events-auto px-2 py-0.5 bg-red-900/60 hover:bg-red-700 text-white rounded border border-red-500/80 text-[10px] flex items-center gap-1 transition-all"
          >
            <X className="w-3 h-3" />
            <span>EXIT HUD</span>
          </button>
        </div>
      </div>

      {/* Screen Corner Bracket Reticles */}
      <div className="absolute top-20 left-6 w-12 h-12 border-t-2 border-l-2 border-red-500/70" />
      <div className="absolute top-20 right-6 w-12 h-12 border-t-2 border-r-2 border-red-500/70" />
      <div className="absolute bottom-10 left-6 w-12 h-12 border-b-2 border-l-2 border-red-500/70" />
      <div className="absolute bottom-10 right-6 w-12 h-12 border-b-2 border-r-2 border-red-500/70" />

      {/* Center Tactical Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <div className="relative w-36 h-36 rounded-full border border-red-500/30 flex items-center justify-center animate-spin" style={{ animationDuration: '24s' }}>
          <div className="w-24 h-24 rounded-full border border-dashed border-red-500/50" />
        </div>
        <div className="absolute w-6 h-6 border-t border-b border-red-400/80" />
        <div className="absolute w-6 h-6 border-l border-r border-red-400/80" />
        <div className="absolute w-1 h-1 bg-red-500 rounded-full" />
      </div>

      {/* Object Detection Bounding Box Overlays */}
      {detectedTargets.map((target) => (
        <div
          key={target.id}
          className="absolute border border-red-500/60 bg-red-500/5 p-2 rounded pointer-events-auto transition-all duration-500 hover:scale-105"
          style={target.pos as React.CSSProperties}
        >
          <div className="flex items-center justify-between gap-3 text-[10px] text-red-300 mb-1 border-b border-red-500/30 pb-0.5">
            <span className="font-bold text-red-400">[{target.id}] {target.label}</span>
            <span className="bg-red-950 text-red-400 px-1 rounded">{target.confidence}%</span>
          </div>
          <div className="text-[9px] text-red-400/90 flex items-center gap-2">
            <span>STATE: {target.status}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>
          {/* Corner highlights */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-400" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-red-400" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-red-400" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-red-400" />
        </div>
      ))}

      {/* Bottom Compass & Status Stream */}
      <div className="absolute bottom-4 left-0 right-0 px-8 flex items-center justify-between text-[10px] text-red-500/80">
        <div className="flex items-center gap-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>IEEE_RAS_RAG_INTELLIGENCE // FACTOR_GRAPH: SYNCHRONIZED</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>DDS_QOS: RELIABLE</span>
          <span>SAFETY_STOP: READY</span>
          <span>AUTONOMY_LEVEL: 4</span>
        </div>
      </div>
    </div>
  );
};
