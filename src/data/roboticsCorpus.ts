import { KnowledgeNode, RetrievedChunk, RoboticsDocument } from '../types';

export interface CorpusEntry {
  id: string;
  source: string;
  title: string;
  category: 'ROS' | 'IEEE RAS' | 'OpenManipulator' | 'Kinematics' | 'SLAM' | 'Vision';
  keywords: string[];
  content: string;
  page?: number;
  url?: string;
}

export const ROBOTICS_CORPUS: CorpusEntry[] = [
  {
    id: 'ieee-ras-01',
    source: 'IEEE RAS Robotics & Automation Handbook',
    title: 'Forward & Inverse Kinematics via Denavit-Hartenberg (D-H) Convention',
    category: 'Kinematics',
    keywords: ['kinematics', 'dh parameters', 'denavit', 'hartenberg', 'forward kinematics', 'inverse kinematics', 'jacobian', 'end effector', 'transformation matrix'],
    content: 'The Denavit-Hartenberg (D-H) parameter representation establishes a standardized 4-parameter framework (link length a_i, link twist alpha_i, link offset d_i, and joint angle theta_i) for attaching coordinate frames to adjacent links in a spatial kinematic chain. The composite homogeneous transformation matrix T = A_1 * A_2 * ... * A_n maps base frame coordinates to the end-effector pose. Inverse Kinematics (IK) computes required joint displacements given desired Cartesian tool poses, utilizing analytical algebraic techniques for 6-DOF decoupled spherical wrists (Pieper criterion) or numerical Jacobian pseudo-inverse and damped least-squares (Levenberg-Marquardt) for redundant systems.',
    page: 42,
    url: 'https://www.ieee-ras.org/educational-resources'
  },
  {
    id: 'ieee-ras-02',
    source: 'IEEE Transactions on Robotics (T-RO)',
    title: 'Simultaneous Localization and Mapping (SLAM): Modern Factor Graph Formulations',
    category: 'SLAM',
    keywords: ['slam', 'lidar', 'factor graph', 'cartographer', 'loop closure', 'pose graph', 'occupancy grid', 'fast-lio', 'ekf', 'point cloud'],
    content: 'Modern SLAM replaces classical recursive Extended Kalman Filters (EKF) with smoothing and mapping over factor graphs (e.g., GTSAM, Ceres Solver). Keyframes establish relative odometric constraints alongside landmark observations and loop closure detections computed via ICP (Iterative Closest Point) or NDT (Normal Distributions Transform). In 2D LiDAR SLAM like Google Cartographer, submap scans are matched against probability grids, while sub-millisecond loop closures are validated via branch-and-bound scan matching, mitigating drift across thousands of meters.',
    page: 118,
    url: 'https://www.ieee-ras.org/publications/t-ro'
  },
  {
    id: 'ros2-doc-01',
    source: 'ROS 2 Humble Documentation & Architecture Spec',
    title: 'DDS Middleware, Executor Concurrency, and Lifecycle Nodes',
    category: 'ROS',
    keywords: ['ros', 'ros 2', 'dds', 'humble', 'node', 'lifecycle', 'executor', 'topic', 'service', 'action', 'rclcpp', 'colcon', 'middleware'],
    content: 'ROS 2 replaces the ROS 1 roscore master daemon with the Data Distribution Service (DDS) standard (OMG DDS spec, implementations like CycloneDDS and FastDDS), enabling decentralized peer-to-peer publish-subscribe communication with Quality of Service (QoS) profiles including Reliability (Reliable vs. Best Effort), Durability (Transient Local vs. Volatile), and History depth. Lifecycle nodes enforce strict deterministic state machine transitions (Unconfigured -> Inactive -> Active -> Finalized), ensuring safety-critical subsystems calibrate sensors before publishing velocity commands.',
    page: 14,
    url: 'https://docs.ros.org/en/humble/'
  },
  {
    id: 'openmanipulator-01',
    source: 'ROBOTIS OpenManipulator-X e-Manual',
    title: 'Dynamixel XM430 Actuator Protocol 2.0 & MoveIt 2 Integration',
    category: 'OpenManipulator',
    keywords: ['openmanipulator', 'dynamixel', 'xm430', 'robotis', 'gripper', 'moveit', 'trajectory', 'torque', 'arm', 'servo', 'urdf'],
    content: 'The OpenManipulator-X is a 4-DOF planar articulated serial manipulator plus 1-DOF parallel gripper driven by daisy-chained DYNAMIXEL XM430-W350-T actuators operating over TTL half-duplex UART at 1-3 Mbps with Protocol 2.0. The URDF model provides precise mass, center of mass, and inertia tensors for Gazebo physics simulation. Integration with MoveIt 2 enables trajectory generation via OMPL (RRT-Connect) and collision avoidance via OctoMap 3D voxel representations.',
    page: 27,
    url: 'https://emanual.robotis.com/docs/en/platform/openmanipulator_x/'
  },
  {
    id: 'ieee-ras-03',
    source: 'IEEE RAS Educational Resources: Autonomous Navigation',
    title: 'Global & Local Path Planning: A*, D* Lite, and Time-Elastic Band (TEB)',
    category: 'SLAM',
    keywords: ['path planning', 'a*', 'astar', 'd*', 'teb', 'costmap', 'nav2', 'obstacle avoidance', 'dijkstra', 'motion planning', 'trajectory'],
    content: 'Autonomous mobile robot navigation employs a dual-tier planning hierarchy. Global planners compute collision-free geometric trajectories on static 2D costmaps using A* search with Euclidean heuristic f(n) = g(n) + h(n), or D* Lite for dynamically evolving maps. Local trajectory controllers such as the Time-Elastic Band (TEB) or Dynamic Window Approach (DWA) optimize robot velocity (v, omega) commands within kinematic limits, deforming trajectories in real-time to avoid unexpected dynamic obstacles detected by laser rangefinders.',
    page: 63,
    url: 'https://www.ieee-ras.org/educational-resources'
  },
  {
    id: 'vision-01',
    source: 'IEEE Robotics & Automation Letters (RA-L)',
    title: 'Real-Time 6D Object Pose Estimation & RGB-D Spatial AI',
    category: 'Vision',
    keywords: ['computer vision', 'yolo', 'rgb-d', 'pointcloud', 'pose estimation', 'depth camera', 'opencv', 'realsense', 'bounding box', 'grasping'],
    content: 'Robotic manipulation in unstructured environments pairs RGB-D cameras (e.g., Intel RealSense D435i, OAK-D) with deep convolutional backbones (YOLOv8, Mask R-CNN) and PointNet++ or DenseFusion networks. These architectures predict 6-DOF rigid transformation [R | t] from the camera frame to object centroid, enabling robotic end-effectors to evaluate collision-free antipodal grasp candidates directly from PointCloud2 sensor streams.',
    page: 204,
    url: 'https://www.ieee-ras.org/publications/ra-l'
  },
  {
    id: 'ros2-doc-02',
    source: 'ROS 2 Navigation Stack (Nav2) Specification',
    title: 'Behavior Trees, Costmap2D Layers, and Recovery Behaviors',
    category: 'ROS',
    keywords: ['nav2', 'navigation', 'behavior tree', 'costmap', 'recovery', 'inflation', 'footprint', 'amcl', 'particle filter'],
    content: 'ROS 2 Nav2 replaces monolithic state machines with modular Behavior Trees (BT.CPP). A root sequence orchestrates ComputePathToPose (global planner), FollowPath (local controller), and Recovery actions (Spin, BackUp, Wait, ClearEntireCostmap). AMCL (Adaptive Monte Carlo Localization) continuously computes probabilistic robot poses using a KLD-sampling particle filter evaluating laser scan likelihood fields.',
    page: 88,
    url: 'https://navigation.ros.org/'
  },
  {
    id: 'ieee-ras-04',
    source: 'IEEE Robotics & Automation Magazine',
    title: 'Reinforcement Learning in Robotics: Sim-to-Real Domain Randomization',
    category: 'Kinematics',
    keywords: ['reinforcement learning', 'rl', 'sim-to-real', 'isaac sim', 'ppo', 'domain randomization', 'quadruped', 'humanoid', 'locomotion'],
    content: 'Transferring deep reinforcement learning policies (e.g., Proximal Policy Optimization - PPO) from simulation (NVIDIA Isaac Sim, MuJoCo) to physical hardware requires comprehensive Domain Randomization. Randomizing link masses, ground friction coefficients, sensor latency, and motor backlash creates robust actor-critic policies capable of dynamic bipedal humanoid balance and quadruped rough-terrain traversal without physical catastrophic failure.',
    page: 55,
    url: 'https://www.ieee-ras.org/publications/ram'
  }
];

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  {
    id: 'node-ros',
    name: 'ROS 2 Humble / Iron',
    category: 'ROS Architecture',
    shortDesc: 'DDS Middleware, QoS Profiles, Lifecycle Nodes & rclcpp',
    position: [-2.2, 1.2, 0],
    color: '#ff2b2b',
    sampleQuestions: [
      'How does DDS Quality of Service (QoS) prevent message loss in ROS 2?',
      'Explain the states of a ROS 2 Lifecycle Node and why they matter in robotics.',
      'What are the advantages of ROS 2 over ROS 1 for multi-robot fleets?'
    ]
  },
  {
    id: 'node-slam',
    name: 'SLAM & Odometry',
    category: 'Localization & Mapping',
    shortDesc: 'Factor Graphs, Cartographer 2D/3D, Fast-LIO & Loop Closures',
    position: [-1.2, -1.1, 0.8],
    color: '#ff6644',
    sampleQuestions: [
      'How does Cartographer perform submap branch-and-bound scan matching?',
      'What is the difference between filter-based and factor-graph SLAM?',
      'How does LiDAR-Inertial Odometry (Fast-LIO) achieve high-frequency pose updates?'
    ]
  },
  {
    id: 'node-kinematics',
    name: 'Robot Kinematics',
    category: 'Manipulators & Arms',
    shortDesc: 'Denavit-Hartenberg (D-H), Forward & Inverse Kinematics, Jacobians',
    position: [1.8, 1.4, -0.4],
    color: '#ff3366',
    sampleQuestions: [
      'Explain the 4 Denavit-Hartenberg (D-H) parameters step by step.',
      'How do you solve Inverse Kinematics for a 4-DOF OpenManipulator arm?',
      'What is a kinematic singularity and how does damped least-squares resolve it?'
    ]
  },
  {
    id: 'node-vision',
    name: 'Spatial AI & Vision',
    category: 'Perception & Sensors',
    shortDesc: 'RGB-D PointCloud2, 6D Object Pose Estimation, YOLOv8',
    position: [2.1, -1.0, 0.5],
    color: '#ff9900',
    sampleQuestions: [
      'How do robots estimate 6D object poses from RGB-D point clouds?',
      'What is the difference between PointNet and voxel-based 3D object detection?',
      'How does an antipodal grasp planner work with depth cameras?'
    ]
  },
  {
    id: 'node-navigation',
    name: 'Nav2 & Path Planning',
    category: 'Autonomous Navigation',
    shortDesc: 'A*, D* Lite, Time-Elastic Band (TEB) & Costmap2D layers',
    position: [0.1, 2.0, -0.8],
    color: '#ff4444',
    sampleQuestions: [
      'How does the A* algorithm compute optimal paths across an occupancy grid?',
      'Explain how the Time-Elastic Band (TEB) local planner avoids dynamic obstacles.',
      'How do inflation layers in Costmap2D ensure collision safety?'
    ]
  },
  {
    id: 'node-humanoid',
    name: 'Humanoids & RL',
    category: 'Advanced Locomotion',
    shortDesc: 'Sim-to-Real Domain Randomization, Zero-Moment Point (ZMP), PPO',
    position: [0.2, -1.8, -0.2],
    color: '#ff1155',
    sampleQuestions: [
      'What is Zero-Moment Point (ZMP) and how is it used in bipedal balance?',
      'How does Sim-to-Real Domain Randomization train robotic locomotion policies?',
      'What are the key actuators used in modern humanoid robots like Tesla Optimus?'
    ]
  }
];

export const INITIAL_INDEXED_DOCS: RoboticsDocument[] = [
  {
    id: 'doc-1',
    name: 'IEEE_RAS_Robotics_Handbook_Ch4.pdf',
    source: 'IEEE RAS Public Archive',
    size: '4.8 MB',
    uploadedAt: '2026-09-18',
    chunkCount: 38,
    status: 'indexed',
    summary: 'Comprehensive kinematic modeling, Denavit-Hartenberg transformations, and singularity analysis.',
    category: 'Kinematics'
  },
  {
    id: 'doc-2',
    name: 'ROS2_Humble_Architecture_Whitepaper.pdf',
    source: 'Open Robotics & IEEE RAS',
    size: '3.2 MB',
    uploadedAt: '2026-09-19',
    chunkCount: 26,
    status: 'indexed',
    summary: 'DDS communications, QoS policies, multi-threaded executors, and node lifecycle architecture.',
    category: 'ROS'
  },
  {
    id: 'doc-3',
    name: 'OpenManipulator_X_Kinematics_Guide.pdf',
    source: 'ROBOTIS & IEEE RAS Lab',
    size: '2.1 MB',
    uploadedAt: '2026-09-20',
    chunkCount: 19,
    status: 'indexed',
    summary: 'DYNAMIXEL XM430-W350 joint control, forward/inverse kinematics, and MoveIt 2 integration.',
    category: 'OpenManipulator'
  },
  {
    id: 'doc-4',
    name: 'LiDAR_SLAM_Cartographer_Tutorial.pdf',
    source: 'IEEE RAS Educational Tutorials',
    size: '5.6 MB',
    uploadedAt: '2026-09-20',
    chunkCount: 42,
    status: 'indexed',
    summary: 'Real-time 2D/3D LiDAR occupancy grid mapping, submap branch-and-bound loop closures.',
    category: 'SLAM'
  }
];

export const TELEMETRY_DATA = {
  averageLatencyMs: 14.8,
  groundingAccuracy: 99.4,
  totalQueriesProcessed: 14820,
  activeUsers: 842,
  recentQueries: [
    { time: '14:00', volume: 420, latency: 15.2 },
    { time: '15:00', volume: 580, latency: 14.1 },
    { time: '16:00', volume: 640, latency: 13.9 },
    { time: '17:00', volume: 510, latency: 14.6 },
    { time: '18:00', volume: 490, latency: 15.0 },
    { time: '19:00', volume: 610, latency: 14.4 },
    { time: '20:00', volume: 530, latency: 14.2 },
  ],
  topicDistribution: [
    { topic: 'ROS 2 & Middleware', percentage: 34, color: '#ff2b2b' },
    { topic: 'Kinematics & D-H Parameters', percentage: 26, color: '#ff6633' },
    { topic: '2D/3D LiDAR SLAM', percentage: 22, color: '#ff9933' },
    { topic: 'Vision & 6-DOF Grasping', percentage: 11, color: '#ffcc33' },
    { topic: 'Humanoid Whole-Body Dynamics', percentage: 7, color: '#ff4488' },
  ],
};

