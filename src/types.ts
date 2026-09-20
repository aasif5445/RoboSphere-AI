export type AIMode = 'beginner' | 'student' | 'engineer' | 'interview';

export interface RetrievedChunk {
  id: string;
  source: string;
  title: string;
  similarity: number; // 0 to 100 percentage
  snippet: string;
  page?: number;
  category: 'ROS' | 'IEEE RAS' | 'OpenManipulator' | 'Kinematics' | 'SLAM' | 'Vision' | 'Uploaded Document';
  url?: string;
}

export interface RAGExplanation {
  confidence: number;
  searchTimeMs: number;
  corpusDocCount: number;
  topSources: { source: string; confidence: number; color: string }[];
  chunks: RetrievedChunk[];
  groundingStatus: 'fully_grounded' | 'partially_grounded' | 'general_knowledge';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: AIMode;
  ragExplanation?: RAGExplanation;
  likes?: 'like' | 'dislike';
}

export interface RoboticsDocument {
  id: string;
  name: string;
  source: string;
  size: string;
  uploadedAt: string;
  chunkCount: number;
  status: 'indexed' | 'processing';
  summary: string;
  category: string;
}

export interface KnowledgeNode {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  position: [number, number, number];
  color: string;
  sampleQuestions: string[];
}

export interface ArmIKState {
  target: { x: number; y: number; z: number };
  angles: { theta1: number; theta2: number; theta3: number };
  endEffector: { x: number; y: number; z: number };
  isReachable: boolean;
  trajectory: { x: number; y: number; z: number }[];
}

export interface SlamPoint {
  x: number;
  y: number;
  type: 'free' | 'occupied' | 'unknown';
}
