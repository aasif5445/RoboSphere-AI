import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Compass, 
  Activity, 
  Target, 
  Maximize2, 
  Sliders, 
  Layers, 
  Crosshair, 
  HelpCircle,
  Cpu,
  MapPin,
  Flame
} from 'lucide-react';
import { sound } from '../utils/audio';

type PlaygroundTab = 'slam' | 'arm' | 'astar';

export const PlaygroundSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PlaygroundTab>('slam');

  return (
    <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>ROBOTICS SIMULATION PLAYGROUND</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
          Interactive Robotics Engines
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Live real-time mathematical visualizations: 2D LiDAR SLAM, Inverse Kinematics (IK), and A* heuristic path planning.
        </p>

        {/* Tab Selector */}
        <div className="mt-6 inline-flex p-1 rounded-xl bg-[#0e0e14] border border-red-500/20 shadow-[0_0_25px_rgba(255,43,43,0.08)]">
          <button
            id="tab-btn-slam"
            onClick={() => {
              sound.playClick();
              setActiveTab('slam');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'slam'
                ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,43,43,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. 2D LIDAR SLAM</span>
          </button>

          <button
            id="tab-btn-arm"
            onClick={() => {
              sound.playClick();
              setActiveTab('arm');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'arm'
                ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,43,43,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>2. INVERSE KINEMATICS (IK)</span>
          </button>

          <button
            id="tab-btn-astar"
            onClick={() => {
              sound.playClick();
              setActiveTab('astar');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-mono transition-all ${
              activeTab === 'astar'
                ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(255,43,43,0.5)]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>3. A* PATH PLANNING</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport Container */}
      <div className="rounded-2xl bg-[#09090e]/95 border border-red-500/25 p-4 sm:p-6 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {activeTab === 'slam' && <SlamDemo />}
        {activeTab === 'arm' && <ArmIKDemo />}
        {activeTab === 'astar' && <AStarDemo />}
      </div>
    </section>
  );
};

// ==========================================
// 1. SLAM DEMO COMPONENT
// ==========================================
const SlamDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [loopClosures, setLoopClosures] = useState(3);
  const [mappedCells, setMappedCells] = useState(0);

  // Simulation State
  const stateRef = useRef({
    robot: { x: 180, y: 160, theta: 0.2, speed: 1.6, angularSpeed: 0.03 },
    path: [] as [number, number][],
    // Obstacles in world
    obstacles: [
      { x: 70, y: 70, w: 60, h: 50 },
      { x: 320, y: 60, w: 80, h: 40 },
      { x: 140, y: 240, w: 100, h: 45 },
      { x: 340, y: 220, w: 60, h: 70 },
      { x: 20, y: 160, w: 40, h: 40 },
    ],
    // 2D Occupancy Grid
    gridWidth: 50,
    gridHeight: 35,
    gridCellSize: 10,
    occupancyGrid: new Array(50 * 35).fill(0.5), // 0.5 unknown, 0 free, 1 occupied
    lidarRaysCount: 36,
    lidarMaxRange: 140,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const state = stateRef.current;
      const { robot, obstacles, gridWidth, gridHeight, gridCellSize, lidarRaysCount, lidarMaxRange } = state;

      // Update Robot pose if running
      if (isRunning) {
        // Forward motion
        const nextX = robot.x + Math.cos(robot.theta) * robot.speed;
        const nextY = robot.y + Math.sin(robot.theta) * robot.speed;

        // Collision or boundary check
        let collides = false;
        if (nextX < 30 || nextX > 470 || nextY < 30 || nextY > 320) {
          collides = true;
        } else {
          for (const obs of obstacles) {
            if (nextX > obs.x - 10 && nextX < obs.x + obs.w + 10 &&
                nextY > obs.y - 10 && nextY < obs.y + obs.h + 10) {
              collides = true;
              break;
            }
          }
        }

        if (collides) {
          robot.theta += Math.PI * 0.4 + (Math.random() - 0.5) * 0.5;
        } else {
          robot.x = nextX;
          robot.y = nextY;
          robot.theta += (Math.random() - 0.5) * 0.08;
        }

        // Add to trajectory path
        if (Math.random() < 0.3) {
          state.path.push([robot.x, robot.y]);
          if (state.path.length > 200) state.path.shift();
        }
      }

      // Clear Screen
      ctx.fillStyle = '#060609';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Occupancy Grid (Known vs Mapped)
      let filled = 0;
      for (let gy = 0; gy < gridHeight; gy++) {
        for (let gx = 0; gx < gridWidth; gx++) {
          const val = state.occupancyGrid[gy * gridWidth + gx];
          if (val !== 0.5) {
            filled++;
            if (val > 0.7) {
              ctx.fillStyle = 'rgba(255, 43, 43, 0.75)'; // Obstacle mapped
            } else {
              ctx.fillStyle = 'rgba(20, 30, 45, 0.6)'; // Free space mapped
            }
            ctx.fillRect(gx * gridCellSize, gy * gridCellSize, gridCellSize - 1, gridCellSize - 1);
          }
        }
      }
      setMappedCells(filled);

      // 2. Draw Simulated Physical Obstacles (Ground Truth outlines)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (const obs of obstacles) {
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
      }

      // 3. Cast LIDAR Rays & Update Occupancy
      const rayHits: { x: number; y: number }[] = [];
      const angleStep = (Math.PI * 2) / lidarRaysCount;

      for (let i = 0; i < lidarRaysCount; i++) {
        const rayAngle = robot.theta + i * angleStep;
        let hitDist = lidarMaxRange;
        let hit = false;

        // Step through ray
        for (let r = 5; r <= lidarMaxRange; r += 4) {
          const rx = robot.x + Math.cos(rayAngle) * r;
          const ry = robot.y + Math.sin(rayAngle) * r;

          // Check grid mapping for free space
          const gx = Math.floor(rx / gridCellSize);
          const gy = Math.floor(ry / gridCellSize);
          if (gx >= 0 && gx < gridWidth && gy >= 0 && gy < gridHeight) {
            state.occupancyGrid[gy * gridWidth + gx] = 0.1; // Mark free
          }

          // Check obstacle collision
          if (rx < 10 || rx > 490 || ry < 10 || ry > 340) {
            hitDist = r;
            hit = true;
            break;
          }
          for (const obs of obstacles) {
            if (rx >= obs.x && rx <= obs.x + obs.w && ry >= obs.y && ry <= obs.y + obs.h) {
              hitDist = r;
              hit = true;
              break;
            }
          }
          if (hit) break;
        }

        const hx = robot.x + Math.cos(rayAngle) * hitDist;
        const hy = robot.y + Math.sin(rayAngle) * hitDist;
        rayHits.push({ x: hx, y: hy });

        if (hit) {
          const gx = Math.floor(hx / gridCellSize);
          const gy = Math.floor(hy / gridCellSize);
          if (gx >= 0 && gx < gridWidth && gy >= 0 && gy < gridHeight) {
            state.occupancyGrid[gy * gridWidth + gx] = 0.95; // Mark occupied
          }
        }

        // Draw Ray Line
        ctx.strokeStyle = hit ? 'rgba(255, 60, 60, 0.35)' : 'rgba(255, 60, 60, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(robot.x, robot.y);
        ctx.lineTo(hx, hy);
        ctx.stroke();
      }

      // 4. Draw Trajectory Path
      if (state.path.length > 1) {
        ctx.strokeStyle = 'rgba(255, 200, 60, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(state.path[0][0], state.path[0][1]);
        for (let p = 1; p < state.path.length; p++) {
          ctx.lineTo(state.path[p][0], state.path[p][1]);
        }
        ctx.stroke();
      }

      // 5. Draw Robot Body & Heading Arrow
      ctx.save();
      ctx.translate(robot.x, robot.y);
      ctx.rotate(robot.theta);

      // Robot Chassis
      ctx.fillStyle = '#ff2b2b';
      ctx.shadowColor = '#ff2b2b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      // Heading indicator
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(14, 0);
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isRunning]);

  const resetMap = () => {
    sound.playClick();
    stateRef.current.occupancyGrid.fill(0.5);
    stateRef.current.path = [];
    stateRef.current.robot = { x: 180, y: 160, theta: 0.2, speed: 1.6, angularSpeed: 0.03 };
    setMappedCells(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Canvas Viewport */}
      <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-red-500/20 bg-black flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={350} 
          className="w-full h-auto max-h-[440px] block"
        />

        {/* Real-Time Telemetry Overlay */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 border border-red-500/30 text-[11px] font-mono text-gray-300 backdrop-blur-md flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>CARTOGRAPHER 2D // FACTOR GRAPH</span>
          </div>
          <span>MAPPED CELLS: {mappedCells}</span>
          <span>LOOP CLOSURES: {loopClosures}</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#0e0e16] border border-white/10 space-y-3">
          <h4 className="font-heading font-bold text-red-400 text-sm flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>LiDAR SLAM Control Unit</span>
          </h4>
          <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
            Simulates an autonomous mobile robot performing simultaneous localization and occupancy grid mapping using 36-beam rangefinder factor graph updates.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsRunning(!isRunning);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold transition-all ${
                isRunning
                  ? 'bg-amber-600/80 hover:bg-amber-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Robot' : 'Start Exploration'}</span>
            </button>

            <button
              onClick={resetMap}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition-all flex items-center gap-1"
              title="Reset Occupancy Grid"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Algorithm Specs & Grounding */}
        <div className="p-4 rounded-xl bg-black/60 border border-red-950 space-y-2 text-[11px]">
          <div className="text-gray-300 font-bold border-b border-white/5 pb-1">ALGORITHMIC PARAMETERS</div>
          <div className="flex justify-between text-gray-400">
            <span>Scan Frequency:</span>
            <span className="text-red-400">20 Hz (36 Beams)</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Range:</span>
            <span className="text-white">14.0 m Max</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Submap Optimizer:</span>
            <span className="text-white">Ceres Non-Linear Least Squares</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Grounding Reference:</span>
            <span className="text-red-400">[IEEE T-RO SLAM, p.118]</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ROBOT ARM INVERSE KINEMATICS (IK) DEMO
// ==========================================
const ArmIKDemo: React.FC = () => {
  const [target, setTarget] = useState({ x: 210, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [angles, setAngles] = useState({ theta1: 45, theta2: 50, theta3: -30 });
  const [reachable, setReachable] = useState(true);

  const L1 = 110;
  const L2 = 95;
  const L3 = 60;
  const origin = { x: 70, y: 250 };

  // Analytical 3-Link IK calculation
  const solveIK = (tx: number, ty: number) => {
    const dx = tx - origin.x;
    const dy = origin.y - ty; // inverted Y in canvas
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxReach = L1 + L2 + L3 - 5;

    if (dist > maxReach) {
      setReachable(false);
      return;
    }
    setReachable(true);

    // Assume end-effector orientation gamma = 0
    const gamma = 0;
    const wx = dx - L3 * Math.cos(gamma);
    const wy = dy - L3 * Math.sin(gamma);
    const dWrist = Math.sqrt(wx * wx + wy * wy);

    if (dWrist > L1 + L2) {
      setReachable(false);
      return;
    }

    // Law of cosines for elbow theta2
    const cosTheta2 = (wx * wx + wy * wy - L1 * L1 - L2 * L2) / (2 * L1 * L2);
    const clampedCos2 = Math.max(-1, Math.min(1, cosTheta2));
    const t2 = Math.acos(clampedCos2);

    // Shoulder theta1
    const alpha = Math.atan2(wy, wx);
    const beta = Math.atan2(L2 * Math.sin(t2), L1 + L2 * Math.cos(t2));
    const t1 = alpha - beta;

    // Wrist theta3
    const t3 = gamma - t1 - t2;

    setAngles({
      theta1: Math.round((t1 * 180) / Math.PI),
      theta2: Math.round((t2 * 180) / Math.PI),
      theta3: Math.round((t3 * 180) / Math.PI),
    });
  };

  useEffect(() => {
    solveIK(target.x, target.y);
  }, [target]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    updateTargetFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isDragging) updateTargetFromEvent(e);
  };

  const handlePointerUp = () => setIsDragging(false);

  const updateTargetFromEvent = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - svg.left);
    const y = Math.round(e.clientY - svg.top);
    setTarget({ x, y });
  };

  // Compute forward joint positions for SVG rendering
  const t1Rad = (angles.theta1 * Math.PI) / 180;
  const t2Rad = (angles.theta2 * Math.PI) / 180;
  const t3Rad = (angles.theta3 * Math.PI) / 180;

  const j1 = { x: origin.x, y: origin.y };
  const j2 = {
    x: j1.x + L1 * Math.cos(t1Rad),
    y: j1.y - L1 * Math.sin(t1Rad),
  };
  const j3 = {
    x: j2.x + L2 * Math.cos(t1Rad + t2Rad),
    y: j2.y - L2 * Math.sin(t1Rad + t2Rad),
  };
  const endEffector = {
    x: j3.x + L3 * Math.cos(t1Rad + t2Rad + t3Rad),
    y: j3.y - L3 * Math.sin(t1Rad + t2Rad + t3Rad),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive SVG Canvas */}
      <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-red-500/20 bg-[#05050a] flex items-center justify-center p-2 select-none">
        <svg
          viewBox="0 0 460 320"
          className="w-full h-auto max-h-[440px] cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Background Grid Lines */}
          <defs>
            <pattern id="armGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="460" height="320" fill="url(#armGrid)" />

          {/* Reachable Workspace Boundary Circle */}
          <circle
            cx={origin.x}
            cy={origin.y}
            r={L1 + L2 + L3 - 5}
            fill="rgba(255,43,43,0.02)"
            stroke="rgba(255,43,43,0.2)"
            strokeDasharray="4 4"
          />

          {/* Pedestal Base */}
          <rect x={origin.x - 24} y={origin.y} width="48" height="30" fill="#1c1c24" stroke="#444" rx="3" />
          <line x1="20" y1={origin.y + 30} x2="440" y2={origin.y + 30} stroke="rgba(255,43,43,0.3)" strokeWidth="2" />

          {/* Link 1 */}
          <line
            x1={j1.x}
            y1={j1.y}
            x2={j2.x}
            y2={j2.y}
            stroke="#2a2a38"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <line
            x1={j1.x}
            y1={j1.y}
            x2={j2.x}
            y2={j2.y}
            stroke="#ff2b2b"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Link 2 */}
          <line
            x1={j2.x}
            y1={j2.y}
            x2={j3.x}
            y2={j3.y}
            stroke="#222230"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1={j2.x}
            y1={j2.y}
            x2={j3.x}
            y2={j3.y}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Link 3 (Tool) */}
          <line
            x1={j3.x}
            y1={j3.y}
            x2={endEffector.x}
            y2={endEffector.y}
            stroke="#ff3344"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Joint Pivots */}
          <circle cx={j1.x} cy={j1.y} r="8" fill="#444" stroke="#ff2b2b" strokeWidth="2" />
          <circle cx={j2.x} cy={j2.y} r="7" fill="#333" stroke="#fff" strokeWidth="2" />
          <circle cx={j3.x} cy={j3.y} r="5" fill="#333" stroke="#ff2b2b" strokeWidth="1.5" />

          {/* Gripper / End-Effector */}
          <circle cx={endEffector.x} cy={endEffector.y} r="5" fill="#ff2b2b" />

          {/* Draggable Target Reticle */}
          <g transform={`translate(${target.x}, ${target.y})`}>
            <circle
              r="14"
              fill={reachable ? 'rgba(255,43,43,0.2)' : 'rgba(255,200,0,0.3)'}
              stroke={reachable ? '#ff2b2b' : '#ffaa00'}
              strokeWidth="2"
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <circle r="6" fill={reachable ? '#ff2b2b' : '#ffaa00'} />
            <line x1="-18" y1="0" x2="18" y2="0" stroke={reachable ? '#ff2b2b' : '#ffaa00'} strokeWidth="1" />
            <line x1="0" y1="-18" x2="0" y2="18" stroke={reachable ? '#ff2b2b' : '#ffaa00'} strokeWidth="1" />
          </g>
        </svg>

        {/* Floating Target Coordinates */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 border border-red-500/30 text-[11px] font-mono text-gray-300 backdrop-blur-md flex items-center gap-3">
          <span className="text-red-400 font-bold">TARGET IK: ({target.x}, {target.y})</span>
          <span className={reachable ? 'text-green-400' : 'text-amber-400 font-bold'}>
            {reachable ? 'REACHABLE' : 'OUT OF WORKSPACE'}
          </span>
        </div>
      </div>

      {/* Arm Telemetry & Joint Control */}
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#0e0e16] border border-white/10 space-y-3">
          <h4 className="font-heading font-bold text-red-400 text-sm flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>Kinematics Solver (OpenManipulator-X)</span>
          </h4>
          <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
            Click or drag anywhere in the workspace to recompute joint angles via inverse kinematics.
          </p>

          {/* Angles Readout */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-white/5">
              <span className="text-gray-400">θ₁ (Shoulder Swivel):</span>
              <span className="text-red-400 font-bold">{angles.theta1}°</span>
            </div>
            <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-white/5">
              <span className="text-gray-400">θ₂ (Elbow Pitch):</span>
              <span className="text-white font-bold">{angles.theta2}°</span>
            </div>
            <div className="flex justify-between items-center bg-black/50 p-2 rounded border border-white/5">
              <span className="text-gray-400">θ₃ (Wrist Pitch):</span>
              <span className="text-red-400 font-bold">{angles.theta3}°</span>
            </div>
          </div>
        </div>

        {/* Predefined Pose Buttons */}
        <div className="p-4 rounded-xl bg-black/60 border border-red-950 space-y-2">
          <div className="text-gray-300 font-bold text-[11px]">PRESET CARTESIAN POSES:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setTarget({ x: 230, y: 90 });
              }}
              className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-red-900/60 text-[10px] text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Reach High
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTarget({ x: 270, y: 220 });
              }}
              className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-red-900/60 text-[10px] text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Grasp Table
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setTarget({ x: 120, y: 150 });
              }}
              className="py-1.5 px-2 rounded bg-zinc-800 hover:bg-red-900/60 text-[10px] text-gray-300 hover:text-white transition-colors border border-white/5"
            >
              Home Tuck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. A* PATH PLANNING COMPONENT
// ==========================================
const AStarDemo: React.FC = () => {
  const COLS = 20;
  const ROWS = 14;

  const [start, setStart] = useState<[number, number]>([2, 2]);
  const [goal, setGoal] = useState<[number, number]>([17, 11]);
  const [grid, setGrid] = useState<number[][]>(() => {
    const g = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    // default obstacle walls
    for (let r = 3; r <= 10; r++) g[r][8] = 1;
    for (let c = 8; c <= 14; c++) g[6][c] = 1;
    return g;
  });

  const [openSet, setOpenSet] = useState<[number, number][]>([]);
  const [closedSet, setClosedSet] = useState<[number, number][]>([]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  // Run Animated A* Search
  const runAStar = async () => {
    sound.playClick();
    setIsSearching(true);
    setOpenSet([]);
    setClosedSet([]);
    setPath([]);

    interface Node {
      r: number;
      c: number;
      g: number;
      h: number;
      f: number;
      parent: Node | null;
    }

    const heuristic = (r1: number, c1: number, r2: number, c2: number) => {
      // Euclidean distance
      return Math.hypot(r1 - r2, c1 - c2);
    };

    const startNode: Node = {
      r: start[0],
      c: start[1],
      g: 0,
      h: heuristic(start[0], start[1], goal[0], goal[1]),
      f: 0,
      parent: null,
    };
    startNode.f = startNode.g + startNode.h;

    const openList: Node[] = [startNode];
    const closedList: boolean[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    const openSetRecord: [number, number][] = [[start[0], start[1]]];
    const closedSetRecord: [number, number][] = [];

    const neighbors = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // Cardinal
      [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal
    ];

    let foundNode: Node | null = null;

    while (openList.length > 0) {
      // Pick lowest f score
      openList.sort((a, b) => a.f - b.f);
      const current = openList.shift()!;

      closedList[current.r][current.c] = true;
      closedSetRecord.push([current.r, current.c]);

      // Check if reached goal
      if (current.r === goal[0] && current.c === goal[1]) {
        foundNode = current;
        break;
      }

      // Expand neighbors
      for (const [dr, dc] of neighbors) {
        const nr = current.r + dr;
        const nc = current.c + dc;

        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (grid[nr][nc] === 1 || closedList[nr][nc]) continue;

        const moveCost = (dr !== 0 && dc !== 0) ? 1.414 : 1.0;
        const tentativeG = current.g + moveCost;

        let existing = openList.find(n => n.r === nr && n.c === nc);
        if (!existing) {
          const hVal = heuristic(nr, nc, goal[0], goal[1]);
          const neighborNode: Node = {
            r: nr,
            c: nc,
            g: tentativeG,
            h: hVal,
            f: tentativeG + hVal,
            parent: current
          };
          openList.push(neighborNode);
          openSetRecord.push([nr, nc]);
        } else if (tentativeG < existing.g) {
          existing.g = tentativeG;
          existing.f = existing.g + existing.h;
          existing.parent = current;
        }
      }

      // Step pause for animation
      setOpenSet([...openSetRecord]);
      setClosedSet([...closedSetRecord]);
      await new Promise(res => setTimeout(res, 20));
    }

    if (foundNode) {
      sound.playAiNotification();
      const finalPath: [number, number][] = [];
      let curr: Node | null = foundNode;
      while (curr) {
        finalPath.unshift([curr.r, curr.c]);
        curr = curr.parent;
      }
      setPath(finalPath);
    }

    setIsSearching(false);
  };

  const toggleCell = (r: number, c: number) => {
    if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1])) return;
    setGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
  };

  const clearObstacles = () => {
    sound.playClick();
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setOpenSet([]);
    setClosedSet([]);
    setPath([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Grid Canvas */}
      <div 
        className="lg:col-span-2 relative rounded-xl overflow-hidden border border-red-500/20 bg-black p-4 flex flex-col items-center justify-center select-none"
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
      >
        <div className="grid gap-1 max-w-full overflow-x-auto" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isStart = r === start[0] && c === start[1];
              const isGoal = r === goal[0] && c === goal[1];
              const isWall = cell === 1;
              const isPath = path.some(([pr, pc]) => pr === r && pc === c);
              const isOpen = openSet.some(([or, oc]) => or === r && oc === c);
              const isClosed = closedSet.some(([cr, cc]) => cr === r && cc === c);

              let bg = 'bg-[#12121a] hover:bg-[#1a1a24]';
              if (isWall) bg = 'bg-red-950 border border-red-800 shadow-[0_0_8px_rgba(255,43,43,0.3)]';
              else if (isStart) bg = 'bg-green-500 text-white font-bold shadow-[0_0_12px_rgba(34,197,94,0.8)]';
              else if (isGoal) bg = 'bg-red-500 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse';
              else if (isPath) bg = 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]';
              else if (isOpen) bg = 'bg-cyan-900/60 border border-cyan-700/50';
              else if (isClosed) bg = 'bg-zinc-800/80';

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  onMouseEnter={() => {
                    if (isMouseDown) toggleCell(r, c);
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[9px] font-mono cursor-pointer transition-all ${bg}`}
                >
                  {isStart ? 'S' : isGoal ? 'G' : ''}
                </div>
              );
            })
          )}
        </div>

        {/* Legend Row */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-gray-400 flex-wrap">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-green-500 rounded" /> Start</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500 rounded" /> Goal</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-950 border border-red-800 rounded" /> Obstacle</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-cyan-900/60 rounded" /> Open Set</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-400 rounded" /> Shortest Path</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#0e0e16] border border-white/10 space-y-3">
          <h4 className="font-heading font-bold text-red-400 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>A* Costmap Planner Controls</span>
          </h4>
          <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
            Click on cells to draw or remove obstacles. The A* algorithm minimizes total estimated cost: <code className="text-red-400">f(n) = g(n) + h(n)</code>.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={runAStar}
              disabled={isSearching}
              className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 text-white transition-all ${
                isSearching
                  ? 'bg-zinc-700 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(255,43,43,0.5)]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSearching ? 'Solving Path...' : 'Execute A* Search'}</span>
            </button>

            <button
              onClick={clearObstacles}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Path Stats */}
        <div className="p-4 rounded-xl bg-black/60 border border-red-950 space-y-2 text-[11px]">
          <div className="text-gray-300 font-bold border-b border-white/5 pb-1">PLANNER METRICS</div>
          <div className="flex justify-between text-gray-400">
            <span>Explored Nodes (Closed):</span>
            <span className="text-white">{closedSet.length}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Frontier Nodes (Open):</span>
            <span className="text-cyan-400">{openSet.length}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Optimal Path Length:</span>
            <span className="text-amber-400 font-bold">{path.length > 0 ? `${path.length} waypoints` : 'Not computed'}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Nav2 Reference:</span>
            <span className="text-red-400">[Nav2 Global Planner, p.88]</span>
          </div>
        </div>
      </div>
    </div>
  );
};
