import re
from typing import List, Dict, Any

class SmartRoboticsChunker:
    """Intelligent semantic text chunker tailored for robotics, ROS, and mathematical manuals."""
    
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 80):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def chunk_text(self, text: str, source_metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Normalize line endings and whitespace
        clean_text = re.sub(r'\r\n', '\n', text)
        clean_text = re.sub(r'[ \t]+', ' ', clean_text).strip()
        
        # Split on natural paragraph or section breaks
        paragraphs = re.split(r'\n{2,}', clean_text)
        chunks: List[Dict[str, Any]] = []
        chunk_idx = 1
        
        current_chunk = ""
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            if len(current_chunk) + len(para) <= self.chunk_size:
                current_chunk += ("\n\n" + para if current_chunk else para)
            else:
                if current_chunk:
                    chunks.append({
                        "id": f"{source_metadata.get('doc_id', 'doc')}-chk-{chunk_idx}",
                        "text": current_chunk,
                        "metadata": {
                            **source_metadata,
                            "chunk_index": chunk_idx,
                            "char_length": len(current_chunk)
                        }
                    })
                    chunk_idx += 1
                
                # If paragraph itself is larger than chunk size, slice with overlap
                if len(para) > self.chunk_size:
                    start = 0
                    while start < len(para):
                        end = start + self.chunk_size
                        slice_text = para[start:end]
                        chunks.append({
                            "id": f"{source_metadata.get('doc_id', 'doc')}-chk-{chunk_idx}",
                            "text": slice_text,
                            "metadata": {
                                **source_metadata,
                                "chunk_index": chunk_idx,
                                "char_length": len(slice_text)
                            }
                        })
                        chunk_idx += 1
                        start += (self.chunk_size - self.chunk_overlap)
                    current_chunk = ""
                else:
                    current_chunk = para
                    
        if current_chunk:
            chunks.append({
                "id": f"{source_metadata.get('doc_id', 'doc')}-chk-{chunk_idx}",
                "text": current_chunk,
                "metadata": {
                    **source_metadata,
                    "chunk_index": chunk_idx,
                    "char_length": len(current_chunk)
                }
            })
            
        return chunks
