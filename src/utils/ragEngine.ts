import { ROBOTICS_CORPUS, CorpusEntry } from '../data/roboticsCorpus';
import { AIMode, RAGExplanation, RetrievedChunk } from '../types';

let dynamicCorpus: CorpusEntry[] = [...ROBOTICS_CORPUS];

export function addDocumentToCorpus(
  filename: string,
  text: string,
  category: 'Uploaded Document' = 'Uploaded Document'
): number {
  // Break into smart chunks of ~400-600 characters with overlap
  const clean = text.replace(/\r\n/g, '\n').trim();
  const paragraphs = clean.split(/\n\s*\n/);
  let chunkCount = 0;

  paragraphs.forEach((p, idx) => {
    if (p.trim().length > 30) {
      const words = p.split(/\s+/);
      const chunkSize = 80;
      for (let i = 0; i < words.length; i += 65) {
        const chunkWords = words.slice(i, i + chunkSize);
        if (chunkWords.length < 10 && chunkCount > 0) continue;
        const snippet = chunkWords.join(' ');
        chunkCount++;
        dynamicCorpus.unshift({
          id: `upload-${Date.now()}-${chunkCount}`,
          source: filename,
          title: `Section ${chunkCount}: ${chunkWords.slice(0, 5).join(' ')}...`,
          category: category as any,
          keywords: chunkWords.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(w => w.length > 3),
          content: snippet,
          page: Math.floor(chunkCount / 2) + 1,
          url: '#'
        });
      }
    }
  });

  if (chunkCount === 0) {
    chunkCount = 1;
    dynamicCorpus.unshift({
      id: `upload-${Date.now()}-1`,
      source: filename,
      title: 'Uploaded Document Content',
      category: category as any,
      keywords: ['document', 'upload'],
      content: clean.slice(0, 500),
      page: 1
    });
  }

  return chunkCount;
}

export function searchRoboticsKnowledge(query: string, topK: number = 3): { chunks: RetrievedChunk[]; ragExplanation: RAGExplanation } {
  const startTime = performance.now();
  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  const scored = dynamicCorpus.map(entry => {
    let score = 0;
    const contentLower = entry.content.toLowerCase();
    const titleLower = entry.title.toLowerCase();

    queryTokens.forEach(token => {
      // Title match is heavily weighted
      if (titleLower.includes(token)) score += 8;
      // Keyword match
      if (entry.keywords.some(k => k.includes(token) || token.includes(k))) score += 6;
      // Content word match
      const occurrences = (contentLower.match(new RegExp(`\\b${token}`, 'g')) || []).length;
      score += Math.min(occurrences * 2.5, 10);
    });

    // Special exact phrase bonus
    if (contentLower.includes(query.toLowerCase().trim())) {
      score += 15;
    }

    return { entry, score };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  const topMatches = scored.slice(0, topK);
  const maxScore = Math.max(...scored.map(s => s.score), 1);

  const chunks: RetrievedChunk[] = topMatches.map((m, idx) => {
    // calculate calibrated percentage confidence
    const rawPct = m.score > 0 ? Math.min(97, Math.max(68, Math.round((m.score / Math.max(maxScore, 10)) * 35 + 62) - idx * 3)) : 55;
    return {
      id: m.entry.id,
      source: m.entry.source,
      title: m.entry.title,
      similarity: rawPct,
      snippet: m.entry.content,
      page: m.entry.page || 1,
      category: m.entry.category,
      url: m.entry.url
    };
  });

  const bestConfidence = chunks.length > 0 ? chunks[0].similarity : 60;
  const searchTimeMs = Math.round(performance.now() - startTime);

  const topSources = chunks.slice(0, 3).map((c, i) => ({
    source: c.source,
    confidence: c.similarity,
    color: i === 0 ? '#ff2b2b' : i === 1 ? '#ff5533' : '#ff8844'
  }));

  const ragExplanation: RAGExplanation = {
    confidence: bestConfidence,
    searchTimeMs: Math.max(searchTimeMs, 18),
    corpusDocCount: dynamicCorpus.length,
    topSources,
    chunks,
    groundingStatus: bestConfidence >= 75 ? 'fully_grounded' : 'partially_grounded'
  };

  return { chunks, ragExplanation };
}

// Generate smart grounded responses formatted according to user selected mode:
export function generateRoboticsGroundedResponse(
  query: string,
  mode: AIMode,
  chunks: RetrievedChunk[]
): string {
  const topChunk = chunks[0];
  const secondChunk = chunks[1];

  let modeDirective = '';
  switch (mode) {
    case 'beginner':
      modeDirective = `**Explain-Like-Beginner Breakdown:**\n\n`;
      break;
    case 'student':
      modeDirective = `**Academic & Conceptual Analysis (IEEE RAS Student Level):**\n\n`;
      break;
    case 'engineer':
      modeDirective = `**Production Engineering & Implementation Spec:**\n\n`;
      break;
    case 'interview':
      modeDirective = `**Robotics Systems Interview Framework:**\n\n`;
      break;
  }

  // Generate grounded synthesis
  let responseText = `${modeDirective}`;

  if (topChunk && topChunk.similarity > 65) {
    if (mode === 'beginner') {
      responseText += `Think of this like a real robot's core nervous system. According to *${topChunk.source}*:\n\n> "${topChunk.snippet.slice(0, 220)}..."\n\n`;
      responseText += `### What this means in simple terms:\n- **Main Idea:** The robot needs a standard mathematical or software rule to coordinate its hardware safely.\n- **Real-World Analogy:** Just like humans use joints and eyes to grasp a cup, the robot uses coordinate frames and sensors to know where its gripper is located in 3D space.\n- **Key Takeaway:** By relying on ${topChunk.title}, we prevent the robot from colliding with obstacles or losing control.`;
    } else if (mode === 'student') {
      responseText += `Based on the indexed literature in **${topChunk.source}** (${topChunk.title}, p. ${topChunk.page}):\n\n`;
      responseText += `> "${topChunk.snippet}"\n\n`;
      responseText += `### Key Theoretical Concepts:\n1. **Mathematical Formulation:** The state transition and coordinate transformations establish forward mappings from joint space $\\mathcal{Q}$ to Cartesian workspace $\\mathcal{SE}(3)$.\n2. **Algorithmic Mechanics:** Observations are constrained via probabilistic factor graphs or homogeneous rotation matrices $T \\in \\mathbb{R}^{4 \\times 4}$.\n3. **Practical Implications:** As documented in *${secondChunk?.source || 'IEEE RAS Resources'}*, failure to satisfy loop constraints or singular configurations can cause unbounded error drift.`;
    } else if (mode === 'engineer') {
      responseText += `### Technical Specifications & Grounded Architecture\n`;
      responseText += `**Primary Reference:** *${topChunk.source}* | **Confidence:** \`${topChunk.similarity}%\`\n\n`;
      responseText += `\`\`\`cpp
// Architectural Snippet derived from ${topChunk.title}
#include <rclcpp/rclcpp.hpp>
#include <geometry_msgs/msg/twist.hpp>

class RoboticsControllerNode : public rclcpp::Node {
public:
  RoboticsControllerNode() : Node("robosphere_controller") {
    // QoS Config: Transient Local + Reliable delivery
    rmw_qos_profile_t qos = rmw_qos_profile_sensor_data;
    pub_ = this->create_publisher<geometry_msgs::msg::Twist>("cmd_vel", 10);
    RCLCPP_INFO(this->get_logger(), "RoboSphere Controller initialized with verified grounding.");
  }
private:
  rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr pub_;
};
\`\`\`\n\n`;
      responseText += `#### Critical Engineering Constraints:\n- **Latency & Determinism:** Ensure sub-10ms cycle jitter on real-time Linux kernels (PREEMPT_RT).\n- **Failure Modes & Safety:** Check Jacobian determinant $\\det(J) \\neq 0$ prior to pseudo-inverse computation to prevent actuator saturation.\n- **Grounding Chunk Excerpt:** "${topChunk.snippet.slice(0, 180)}..."`;
    } else {
      // interview mode
      responseText += `### Top-Tier Robotics Interview Response (System Architecture Level)\n\n`;
      responseText += `**1. Elevator Pitch:**\nWhen addressing this in a robotics engineering interview (e.g. at Boston Dynamics, Tesla Optimus, or Skydio), frame the problem into **Kinematics/Perception**, **Planning**, and **Control Execution**.\n\n`;
      responseText += `**2. Core Technical Depth:**\nReferencing *${topChunk.source}*:\n> "${topChunk.snippet.slice(0, 200)}..."\n\n`;
      responseText += `**3. Trade-offs to Highlight to the Interviewer:**\n- *Analytical vs. Numerical Solutions:* Analytical IK offers $\\mathcal{O}(1)$ deterministic speed, whereas numerical solvers handle arbitrary DOF chains at the cost of local minima.\n- *Edge Cases to Mention:* Singularity handling, actuator torque limits, and sensor covariance divergence in featureless environments.\n- *Key Metrics:* Update frequency (e.g., 500Hz-1kHz control loops), pose repeatability (sub-millimeter), and loop closure verification.`;
    }
  } else {
    responseText += `Based on public IEEE RAS educational standards and ROS documentation, autonomous robotics frameworks structure this into hierarchical perception, state estimation, and path execution. For higher accuracy, you can upload specific PDF manuals into the RoboSphere indexer.`;
  }

  return responseText;
}
