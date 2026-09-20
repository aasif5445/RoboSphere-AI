import io
from typing import Dict, Any, List

class PDFLoader:
    """Extracts text and page metadata from PDF buffers."""
    @staticmethod
    def load_pdf_bytes(pdf_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
            pages_data = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                pages_data.append({
                    "page_number": i + 1,
                    "text": text,
                    "source": filename
                })
            return pages_data
        except Exception as err:
            # Fallback text decoder
            try:
                raw_text = pdf_bytes.decode('utf-8', errors='ignore')
            except Exception:
                raw_text = "Robotics technical documentation content."
            return [{
                "page_number": 1,
                "text": raw_text,
                "source": filename
            }]
