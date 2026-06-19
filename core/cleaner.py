import re

class TextCleaner:
    """
    Handles the preprocessing and cleaning of raw textual data.
    Removes excess whitespaces, metadata noise, system logs,
    and standardizes paragraph structures.
    """
    def __init__(self):
        pass

    def clean(self, text: str) -> str:
        if not text:
            return ""

        # 1. Remove duplicate empty lines
        cleaned = re.sub(r'\n\s*\n', '\n\n', text)

        # 2. Strip surrounding whitespaces from each line
        lines = [line.strip() for line in cleaned.split('\n')]
        
        # 3. Join lines back
        cleaned = '\n'.join(lines)

        # 4. Remove excessive horizontal spaces
        cleaned = re.sub(r'[ \t]+', ' ', cleaned)

        # 5. Remove HTML tags if accidentally pasted
        cleaned = re.sub(r'<[^>]+>', '', cleaned)

        # 6. Remove metadata patterns (like typical slide numbers or timestamp lines)
        cleaned = re.sub(r'Page \d+ of \d+|\[\d{2}:\d{2}:\d{2}\]', '', cleaned, flags=re.IGNORECASE)

        return cleaned.strip()
