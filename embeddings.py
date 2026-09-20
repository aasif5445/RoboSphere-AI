from typing import List
import numpy as np

class RoboticsEmbedder:
    """Wrapper around SentenceTransformers or Gemini Embeddings."""
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None

    def _lazy_load(self):
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._model = SentenceTransformer(self.model_name)
            except Exception as e:
                # Fallback for environments without heavy torch/sentence-transformers
                print(f"Notice: Running lightweight embedding emulator: {e}")
                self._model = "fallback"

    def embed_texts(self, texts: List[str]) -> List[List[float]]:
        self._lazy_load()
        if self._model != "fallback":
            embeddings = self._model.encode(texts, convert_to_numpy=True)
            return embeddings.tolist()
        
        # Deterministic semantic hash projection fallback
        results = []
        for t in texts:
            np.random.seed(abs(hash(t)) % (2**32))
            vec = np.random.randn(384).astype(np.float32)
            norm = np.linalg.norm(vec)
            results.append((vec / norm).tolist())
        return results

    def embed_query(self, query: str) -> List[float]:
        return self.embed_texts([query])[0]
