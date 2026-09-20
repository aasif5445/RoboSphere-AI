import React, { useState } from 'react';
import { 
  Terminal, 
  Compass, 
  Eye, 
  Cpu, 
  Target, 
  Navigation, 
  Wind, 
  Bot, 
  ArrowRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowledgeExplorerProps {
  onSelectQuestion: (question: string) => void;
}

interface CategoryCard {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tags: string[];
  sampleQuestions: string[];
  gradient: string;
}

export const KnowledgeExplorer: React.FC<KnowledgeExplorerProps> = ({ onSelectQuestion }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: CategoryCard[] = [
    {
      id: 'cat-ros',
      title: 'ROS 2 Humble & Iron',
      category: 'Middleware & Architecture',
      icon: Terminal,
      description: 'DDS communications, zero-copy intra-process transport, lifecycle state machine nodes, and QoS durability configurations.',
      tags: ['DDS', 'QoS', 'rclcpp', 'Lifecycle', 'FastDDS'],
      sampleQuestions: [
        'How does DDS Quality of Service (QoS) prevent message loss in ROS 2?',
        'Explain the states of a ROS 2 Lifecycle Node and why they matter in robotics.',
        'How does ROS 2 zero-copy intra-process transport achieve sub-millisecond latency?'
      ],
      gradient: 'from-red-900/40 via-red-950/20 to-black'
    },
    {
      id: 'cat-slam',
      title: 'SLAM & State Estimation',
      category: 'Localization & Mapping',
      icon: Compass,
      description: 'Factor graphs, Google Cartographer 2D/3D, LiDAR-Inertial Odometry (Fast-LIO), and loop closure optimization via Ceres solver.',
      tags: ['Cartographer', 'Factor Graphs', 'Fast-LIO', 'GTSAM', 'Loop Closure'],
      sampleQuestions: [
        'How does Cartographer perform submap branch-and-bound scan matching?',
        'What is the difference between filter-based and factor-graph SLAM?',
        'How does LiDAR-Inertial Odometry (Fast-LIO) achieve high-frequency pose updates?'
      ],
      gradient: 'from-orange-950/40 via-red-950/20 to-black'
    },
    {
      id: 'cat-vision',
      title: 'Computer Vision & Spatial AI',
      category: 'Perception & 3D Sensing',
      icon: Eye,
      description: 'RGB-D PointCloud2 processing, 6-DOF object pose estimation, YOLOv8 bounding boxes, and antipodal grasp planning.',
      tags: ['YOLOv8', 'PointCloud2', 'RGB-D', 'GraspNet', 'OpenCV'],
      sampleQuestions: [
        'How do robots estimate 6D object poses from RGB-D point clouds?',
        'What is the difference between PointNet and voxel-based 3D object detection?',
        'How does an antipodal grasp planner work with depth cameras?'
      ],
      gradient: 'from-amber-950/40 via-red-950/20 to-black'
    },
    {
      id: 'cat-rl',
      title: 'Reinforcement Learning & Sim-to-Real',
      category: 'Machine Learning',
      icon: Cpu,
      description: 'Domain Randomization in NVIDIA Isaac Sim / MuJoCo, Proximal Policy Optimization (PPO), and actor-critic locomotion policies.',
      tags: ['PPO', 'Isaac Sim', 'Domain Randomization', 'MuJoCo', 'Sim-to-Real'],
      sampleQuestions: [
        'How does Sim-to-Real Domain Randomization train robotic locomotion policies?',
        'What loss functions are used in Proximal Policy Optimization (PPO) for quadrupeds?',
        'How does NVIDIA Isaac Gym achieve massive parallel GPU physics simulation?'
      ],
      gradient: 'from-red-950/50 via-zinc-950/40 to-black'
    },
    {
      id: 'cat-manipulators',
      title: 'Manipulators & Kinematics',
      category: 'Robot Arm Dynamics',
      icon: Target,
      description: 'Denavit-Hartenberg parameters, Jacobian transpose and pseudo-inverse, damped least-squares singularity avoidance, and MoveIt 2.',
      tags: ['DH Parameters', 'Jacobians', 'MoveIt 2', 'Singularities', 'DYNAMIXEL'],
      sampleQuestions: [
        'Explain the 4 Denavit-Hartenberg (D-H) parameters step by step.',
        'How do you solve Inverse Kinematics for a 4-DOF OpenManipulator arm?',
        'What is a kinematic singularity and how does damped least-squares resolve it?'
      ],
      gradient: 'from-rose-950/40 via-red-950/20 to-black'
    },
    {
      id: 'cat-nav2',
      title: 'Motion Planning & Nav2',
      category: 'Autonomous Navigation',
      icon: Navigation,
      description: 'Time-Elastic Band (TEB) local trajectory deformation, Costmap2D inflation layers, AMCL particle filtering, and Behavior Trees.',
      tags: ['TEB Planner', 'Costmap2D', 'Behavior Trees', 'AMCL', 'D* Lite'],
      sampleQuestions: [
        'How does the A* algorithm compute optimal paths across an occupancy grid?',
        'Explain how the Time-Elastic Band (TEB) local planner avoids dynamic obstacles.',
        'How do inflation layers in Costmap2D ensure collision safety?'
      ],
      gradient: 'from-red-900/30 via-stone-950/30 to-black'
    },
    {
      id: 'cat-drones',
      title: 'Drones & Aerial Robotics',
      category: 'Unmanned Aerial Systems',
      icon: Wind,
      description: 'PX4 Autopilot integration, MAVROS, SE(3) geometric attitude control, minimum-snap trajectory generation, and optical flow.',
      tags: ['PX4', 'MAVROS', 'Minimum Snap', 'SE(3) Control', 'Optical Flow'],
      sampleQuestions: [
        'How does SE(3) geometric attitude control stabilize quadrotors under aggressive maneuvers?',
        'What is minimum-snap trajectory generation and why is snap minimized instead of acceleration?',
        'How does optical flow complement GPS-denied drone navigation?'
      ],
      gradient: 'from-red-950/40 via-red-900/10 to-black'
    },
    {
      id: 'cat-humanoids',
      title: 'Humanoids & Bipedal Balance',
      category: 'Whole-Body Dynamics',
      icon: Bot,
      description: 'Zero-Moment Point (ZMP) preview control, Capture Point (CP), floating-base whole-body controllers (WBC), and high-torque actuators.',
      tags: ['ZMP', 'Capture Point', 'WBC', 'Tesla Optimus', 'Bipedal Locomotion'],
      sampleQuestions: [
        'What is Zero-Moment Point (ZMP) and how is it used in bipedal balance?',
        'How do Capture Point (CP) dynamics prevent humanoid falling?',
        'What are the key actuators and cycloidal drives used in modern humanoid robots?'
      ],
      gradient: 'from-red-900/50 via-zinc-900/30 to-black'
    },
  ];

  return (
    <section id="knowledge" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>IEEE RAS CURATED KNOWLEDGE REPOSITORY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white tracking-wide">
          Knowledge Explorer
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Curated conceptual domains grounded in public robotics papers, tutorials, and system whitepapers.
        </p>
      </div>

      {/* Interactive 3D Tilt Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              id={`card-${cat.id}`}
              onMouseEnter={() => sound.playHoverTick()}
              className="group relative rounded-2xl bg-gradient-to-b from-[#11111a] to-[#07070b] border border-white/10 hover:border-red-500/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(255,43,43,0.18)] cursor-pointer"
            >
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Category Header & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,43,43,0.2)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/5">
                    {cat.category}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-red-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed font-sans line-clamp-3">
                  {cat.description}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cat.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/30 text-red-400 border border-red-900/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Questions Drawer */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">
                  Quick Query:
                </span>
                {cat.sampleQuestions.slice(0, 2).map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.playClick();
                      onSelectQuestion(q);
                    }}
                    className="w-full text-left text-[11px] text-gray-400 hover:text-red-300 transition-colors flex items-center justify-between gap-1 py-1 group/q"
                  >
                    <span className="truncate">{q}</span>
                    <ArrowRight className="w-3 h-3 text-red-500 opacity-0 group-hover/q:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
