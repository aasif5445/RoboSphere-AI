import os
from typing import List, Dict, Any
from chunker import SmartRoboticsChunker
from embeddings import RoboticsEmbedder

class RoboticsRAGPipeline:
    """Core RAG retrieval and citation engine for IEEE RAS RoboSphere."""
    
    def __init__(self):
        self.chunker = SmartRoboticsChunker()
        self.embedder = RoboticsEmbedder()
        self.vector_store: List[Dict[str, Any]] = []
        self._seed_default_corpus()

    def _seed_default_corpus(self):
        seed_docs = [
            {
                "title": "IEEE RAS Kinematics & Jacobians",
                "source": "IEEE RAS Handbook Ch. 4",
                "text": "Denavit-Hartenberg (D-H) parameter representation establishes a standardized 4-parameter framework (link length a_i, link twist alpha_i, link offset d_i, and joint angle theta_i). Inverse Kinematics computes required joint displacements given desired Cartesian tool poses, utilizing analytical algebraic techniques or numerical Jacobian pseudo-inverse and damped least-squares.",
                "page": 42
            },
            {
                "title": "ROS 2 Humble Architecture & DDS QoS",
                "source": "ROS 2 Humble Documentation",
                "text": "ROS 2 replaces roscore with Data Distribution Service (DDS), enabling decentralized peer-to-peer publish-subscribe communication with Quality of Service (QoS) profiles including Reliability, Durability, and History depth. Lifecycle nodes enforce strict deterministic state machine transitions.",
                "page": 14
            },
            {
                "title": "Simultaneous Localization and Mapping (SLAM)",
                "source": "IEEE Transactions on Robotics",
                "text": "Modern SLAM utilizes smoothing and mapping over factor graphs. In 2D LiDAR SLAM like Google Cartographer, submap scans are matched against probability grids, while loop closures are validated via branch-and-bound scan matching.",
                "page": 118
            }
        ]
        for doc in seed_docs:
            chunks = self.chunker.chunk_text(doc["text"], {"source": doc["source"], "title": doc["title"], "page": doc["page"]})
            for c in chunks:
                vec = self.embedder.embed_query(c["text"])
                self.vector_store.append({**c, "vector": vec})

    def query(self, question: str, top_k: int = 3) -> Dict[str, Any]:
        q_vec = self.embedder.embed_query(question)
        
        # Cosine similarity ranking
        scored = []
        for item in self.vector_store:
            v = item["vector"]
            # dot product (normalized vectors)
            sim = sum(a * b for a, b in zip(q_vec, v))
            scored.append((sim, item))
            
        scored.sort(key=lambda x: x[0], reverse=True)
        top = scored[:top_k]
        
        retrieved_chunks = []
        for sim, item in top:
            confidence = int(min(97, max(65, (sim + 1) / 2 * 100)))
            retrieved_chunks.append({
                "source": item["metadata"]["source"],
                "title": item["metadata"]["title"],
                "page": item["metadata"].get("page", 1),
                "snippet": item["text"],
                "confidence": confidence
            })
            
        return {
            "query": question,
            "chunks": retrieved_chunks,
            "top_confidence": retrieved_chunks[0]["confidence"] if retrieved_chunks else 60
        }
