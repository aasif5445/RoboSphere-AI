import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ROBOTICS_CORPUS, INITIAL_INDEXED_DOCS, KNOWLEDGE_NODES } from "./src/data/roboticsCorpus";
import { searchRoboticsKnowledge, generateRoboticsGroundedResponse, addDocumentToCorpus } from "./src/utils/ragEngine";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "RoboSphere AI Kernel — IEEE RAS RAG System",
    timestamp: new Date().toISOString(),
    geminiAvailable: Boolean(process.env.GEMINI_API_KEY),
    indexedDocumentsCount: INITIAL_INDEXED_DOCS.length,
    corpusSnippetsCount: ROBOTICS_CORPUS.length,
  });
});

// Knowledge nodes endpoint
app.get("/api/knowledge-nodes", (req, res) => {
  res.json({ nodes: KNOWLEDGE_NODES });
});

// Documents catalog endpoint
app.get("/api/documents", (req, res) => {
  res.json({ documents: INITIAL_INDEXED_DOCS });
});

// Ingest / Upload document endpoint
app.post("/api/upload", (req, res) => {
  try {
    const { filename, content, category } = req.body;
    if (!filename || !content) {
      return res.status(400).json({ error: "Filename and content are required" });
    }
    const chunkCount = addDocumentToCorpus(filename, content, category || 'Uploaded Document');
    res.json({
      success: true,
      filename,
      chunkCount,
      status: "indexed",
      message: `Successfully indexed ${chunkCount} chunks into RoboSphere RAG vector store.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to index document" });
  }
});

// Chat endpoint with RAG Grounding & Gemini Generation
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, mode = 'engineer' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // 1. Vector / Keyword retrieval over robotics corpus
    const { chunks, ragExplanation } = searchRoboticsKnowledge(prompt, 3);

    const gemini = getGeminiClient();

    // 2. If Gemini API is configured, generate grounded response
    if (gemini) {
      try {
        const citationsContext = chunks
          .map((c, i) => `[Document ${i + 1}: ${c.source} - "${c.title}" (Page ${c.page || 'N/A'}, Similarity: ${c.similarity}%)]:\n${c.snippet}`)
          .join("\n\n");

        let modePrompt = "";
        if (mode === "beginner") {
          modePrompt = "Explain in intuitive, beginner-friendly terms with everyday analogies, avoiding unnecessary math.";
        } else if (mode === "student") {
          modePrompt = "Explain with rigorous academic precision suitable for an IEEE RAS robotics student. Mention equations, algorithms, and key theorems.";
        } else if (mode === "engineer") {
          modePrompt = "Provide an expert production robotics engineering answer with C++/ROS 2 or Python code snippets, architecture details, and hardware constraints.";
        } else if (mode === "interview") {
          modePrompt = "Format as a high-caliber robotics engineering interview answer (Tesla, Boston Dynamics, Figure level) with system design trade-offs, edge cases, and metrics.";
        }

        const systemInstruction = `You are RoboSphere AI, the official IEEE Robotics and Automation Society (IEEE RAS) RAG Assistant and next-generation robotics operating system intelligence layer.
You answer questions on robotics, ROS 2, kinematics, SLAM, manipulators, computer vision, and autonomous systems.
CRITICAL RAG REQUIREMENT:
- Ground your answer firmly in the provided retrieved robotics literature chunks below whenever relevant.
- Include explicit citations like [IEEE RAS Handbook, p.42] or [ROS 2 Humble Docs, p.14] in your answer.
- ${modePrompt}
- If the retrieved context does not contain the answer, answer accurately using validated robotics theory while clearly stating the boundary.

RETRIEVED ROBOTICS SOURCES:
${citationsContext}`;

        const response = await gemini.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const generatedText = response.text || generateRoboticsGroundedResponse(prompt, mode, chunks);

        return res.json({
          text: generatedText,
          chunks,
          ragExplanation,
          modelUsed: "gemini-3.8-flash",
        });
      } catch (geminiError: any) {
        console.warn("Gemini API call warning, falling back to embedded grounded synthesis:", geminiError?.message);
        const fallbackText = generateRoboticsGroundedResponse(prompt, mode, chunks);
        return res.json({
          text: fallbackText,
          chunks,
          ragExplanation,
          modelUsed: "robosphere-rag-kernel-local",
        });
      }
    }

    // 3. Deterministic high-precision fallback when no API key is active
    const fallbackText = generateRoboticsGroundedResponse(prompt, mode, chunks);
    return res.json({
      text: fallbackText,
      chunks,
      ragExplanation,
      modelUsed: "robosphere-rag-kernel-local",
    });

  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RoboSphere AI Kernel online on http://0.0.0.0:${PORT}`);
  });
}

startServer();
