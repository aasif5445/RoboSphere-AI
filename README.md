# 🤖 RoboSphere AI — IEEE RAS Autonomous RAG Assistant

<div align="center">

[![IEEE RAS](https://img.shields.io/badge/IEEE-Robotics_%26_Automation_Society-red?style=for-the-badge&logo=ieee)](https://www.ieee-ras.org/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)](https://github.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Python FastAPI](https://img.shields.io/badge/FastAPI-RAG_Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue?style=for-the-badge)](LICENSE)

**An award-winning, production-grade Retrieval-Augmented Generation (RAG) assistant designed for the IEEE Robotics and Automation Society (IEEE RAS). Grounded in peer-reviewed literature, ROS 2 Humble specifications, and autonomous robotics algorithms.**

[Explore Live Demo](#) • [Features](#key-features) • [Architecture](#system-architecture) • [Quick Start](#quick-start)

</div>

---

## ⚡ System Architecture

```
                                  USER INTERFACE LAYER
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │  React 19 + Tailwind CSS + Web Audio Synthesizer + Three.js 60 FPS Viewport     │
  │  ├── 3D Robotic Arm & Gyro Core Orb      ├── Robot Vision Mode Tactical HUD    │
  │  ├── AI Chat Stream (4 Modes)            ├── RAG Explainability Proof Panel    │
  │  └── Interactive Simulators: (1) LiDAR SLAM  (2) IK Arm  (3) A* Path Planning │
  └───────────────────────────────────────┬────────────────────────────────────────┘
                                          │ JSON RPC / REST API
                                          ▼
                                EXPRESS / NODE PROXY LAYER
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │  Express 4 Proxy + Vite SPA Engine (Port 3000)                                  │
  │  ├── POST /api/chat     ──> Dispatches query to RAG Kernel                     │
  │  ├── POST /api/upload   ──> Dynamic document chunking & vector indexing        │
  │  └── GET  /api/health   ──> System telemetry, memory & DDS status              │
  └───────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          ▼
                             RAG VECTOR & INFERENCE KERNEL
  ┌────────────────────────────────────────────────────────────────────────────────┐
  │  ChromaDB / TF-IDF Vector Space + Google Gemini AI Grounding Engine            │
  │  ├── IEEE RAS Robotics Handbook (Ch. 1-12)                                     │
  │  ├── ROS 2 Humble Architecture & DDS QoS Middleware Manuals                    │
  │  ├── OpenManipulator-X D-H Kinematics & DYNAMIXEL Actuator Specs               │
  │  └── Factor Graph 2D/3D LiDAR SLAM (Cartographer / Fast-LIO / GTSAM)           │
  └────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 1. Real RAG Grounding & Explainability
* **Verifiable Citations:** Every AI answer includes document citations with percentage confidence scores.
* **Exact Chunks Proof:** Inspect exact source snippets and page numbers extracted from IEEE RAS literature.
* **4 Tailored AI Modes:**
  * 🟢 **Beginner:** Intuitive physical analogies for foundational concepts.
  * 🔵 **Student:** Academic rigor with equations, formulas, and D-H transformation matrices.
  * 🔴 **Engineer:** Production C++ / Python ROS 2 code, QoS configurations, and URDF snippets.
  * 🟣 **Interview:** Job-ready answers tailored for Tier-1 robotics companies (Tesla, Boston Dynamics, Figure AI).

### 2. "Robot Vision Mode" HUD Overlay
* Transforms the entire UI into an authentic first-person robot HUD.
* Real-time scanlines, pitch/yaw telemetry, and dynamic object detection bounding boxes with confidence overlays.
* Non-intrusive procedural audio synthesized with the browser's Web Audio API.

### 3. Interactive Robotics Playground (3 Live Visualizers)
* **2D LiDAR SLAM:** Real-time mobile robot executing 36-beam LiDAR raycasting, dynamic occupancy grid mapping, and loop closure optimization.
* **Inverse Kinematics (IK) Arm:** 3-link planar manipulator solving joint angles $(\theta_1, \theta_2, \theta_3)$ for user-dragged Cartesian targets.
* **A\* Path Planning:** Interactive grid costmap planner with obstacle toggling, animated open/closed set frontiers, and optimal path tracing.

### 4. Technical Document Ingestion
* Drag-and-drop ingestion of PDFs, TXT, and Markdown files.
* Automated semantic chunking and dynamic indexing for instant Q&A.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Three.js (WebGL 60 FPS)
* **Audio Engine:** Web Audio API procedural synthesizer (zero external sound file dependencies)
* **Server & Proxy:** Express, tsx, esbuild
* **Python Microservice:** FastAPI, ChromaDB, PyPDF2, BeautifulSoup4
* **AI & Embeddings:** Google GenAI / Gemini API, all-MiniLM-L6-v2 vector embeddings

---

## 🚀 Quick Start

### Prerequisites
* Node.js 18+ / 20+
* npm or bun

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/ieee-ras/robosphere-ai.git
cd robosphere-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Add GEMINI_API_KEY if desired (hybrid fallback enabled by default)

# 4. Launch dev server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build & Containerization
```bash
# Build production bundle
npm run build

# Start production server
npm start

# Or run via Docker
docker build -t robosphere-ai .
docker run -p 3000:3000 robosphere-ai
```

---

## 📚 IEEE RAS Literature Citations

RoboSphere AI is grounded in publicly accessible educational literature:
1. *Siciliano, B., & Khatib, O. (Eds.). (2016).* **Springer Handbook of Robotics.** IEEE RAS.
2. *Macenski, S., et al. (2022).* **Robot Operating System 2 (ROS 2): Design, Architecture, and Uses in the Wild.** Science Robotics.
3. *Hess, W., et al. (2016).* **Real-Time Loop Closure in 2D LIDAR SLAM.** IEEE ICRA.
4. *ROBOTIS Co., Ltd. (2023).* **OpenManipulator-X Kinematics e-Manual & DYNAMIXEL Protocol 2.0.**

---

<div align="center">

Developed with pride for the **IEEE Robotics and Automation Society (IEEE RAS)**.

</div>
