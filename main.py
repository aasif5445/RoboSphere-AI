from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from rag import RoboticsRAGPipeline
from pdf_loader import PDFLoader

app = FastAPI(
    title="RoboSphere AI Kernel — IEEE RAS Microservice",
    description="Production-grade RAG and Robotics Q&A service grounded in public IEEE RAS and ROS 2 documentation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = RoboticsRAGPipeline()

class ChatRequest(BaseModel):
    prompt: str
    mode: Optional[str] = "engineer"

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "RoboSphere AI FastAPI Microservice",
        "vector_store_chunks": len(pipeline.vector_store),
        "society": "IEEE Robotics and Automation Society (IEEE RAS)"
    }

@app.post("/chat")
def chat(req: ChatRequest):
    if not req.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    rag_result = pipeline.query(req.prompt, top_k=3)
    return {
        "query": req.prompt,
        "mode": req.mode,
        "rag_grounding": rag_result,
        "status": "grounded_success"
    }

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    pages = PDFLoader.load_pdf_bytes(contents, file.filename)
    added_count = 0
    for p in pages:
        chunks = pipeline.chunker.chunk_text(p["text"], {"source": file.filename, "page": p["page_number"], "title": f"{file.filename} - Page {p['page_number']}"})
        for c in chunks:
            vec = pipeline.embedder.embed_query(c["text"])
            pipeline.vector_store.append({**c, "vector": vec})
            added_count += 1
            
    return {
        "filename": file.filename,
        "pages_processed": len(pages),
        "chunks_indexed": added_count,
        "status": "indexed_successfully"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
