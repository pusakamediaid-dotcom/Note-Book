import json

class ContentExporter:
    """
    Handles exporting and formatting of processed text into target structures
    such as Markdown files, JSON schema payloads, or structured plain text.
    """
    def __init__(self):
        pass

    def format_output(self, content: str, format_type: str) -> str:
        if not content:
            return ""

        format_type_lower = format_type.lower()

        if "markdown" in format_type_lower:
            return content # Already in markdown format natively
            
        elif "json" in format_type_lower:
            # Wrap content inside a structured JSON payload
            structured_data = {
                "source": "Smart Content Purifier & Summary Hub",
                "organization": "Pusaka Media ID",
                "status": "success",
                "processed_data": {
                    "raw_content": content,
                    "character_count": len(content),
                    "word_count": len(content.split())
                }
            }
            return json.dumps(structured_data, indent=2, ensure_ascii=False)
            
        elif "text" in format_type_lower or "plain" in format_type_lower:
            # Strip markdown indicators
            plain = content.replace("### ", "").replace("#### ", "").replace("- ", "* ")
            return plain
            
        else:
            return f"--- Format [{format_type}] ---\n\n{content}"
