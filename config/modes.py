# config/modes.py - Configurations for processing and formats

PROCESSING_MODES = {
    "Rangkuman Eksekutif (Executive Summary)": "Generates a structured executive brief summarizing core arguments.",
    "Poin-Poin Penting (Bullet Points)": "Extracts main actionable items and bullet points from the text.",
    "Format Ebook / Bab (Structured Chapter)": "Organizes messy raw notes into a cleanly structured ebook chapter draft.",
    "Catatan Belajar / Studi": "Converts complex transcripts or notes into study guide lists.",
    "Caption / Kutipan Media Sosial": "Condenses content into a concise, catchy quote or social caption structure."
}

EXPORT_FORMATS = {
    "Markdown (.md)": "Saves as Markdown with structured heading layouts.",
    "JSON Payload (.json)": "Saves inside a standardized JSON response format.",
    "Teks Polos (.txt)": "Exports as regular plaintext."
}
