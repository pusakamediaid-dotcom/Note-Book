import os
import gradio as gr
from core.cleaner import TextCleaner
from core.processor import ContentProcessor
from core.exporter import ContentExporter
from config.modes import PROCESSING_MODES, EXPORT_FORMATS

def process_pipeline(text, mode, target_format, min_summary_len, max_summary_len):
    """
    Main pipeline to clean, process, and format text based on selected modes.
    """
    if not text.strip():
        return "Silakan masukkan teks mentah terlebih dahulu.", ""

    # Step 1: Clean text (remove junk characters, fix spacing, standard formatting)
    cleaner = TextCleaner()
    cleaned_text = cleaner.clean(text)

    # Step 2: Content Processing (summarize, extract highlights, bullet points)
    processor = ContentProcessor()
    processed_content = processor.process(
        text=cleaned_text, 
        mode=mode, 
        min_len=min_summary_len, 
        max_len=max_summary_len
    )

    # Step 3: Format & Exporting (convert to markdown, json, etc.)
    exporter = ContentExporter()
    formatted_output = exporter.format_output(processed_content, format_type=target_format)

    return cleaned_text, formatted_output

# Create Gradio interface
with gr.Blocks(title="Smart Content Purifier & Summary Hub", theme=gr.themes.Soft()) as demo:
    gr.Markdown(
        """
        # 📚 Smart Content Purifier & Summary Hub
        ### Transformasikan Teks Mentah Menjadi Konten Siap Pakai Premium
        Dibuat oleh **Pusaka Media ID** sebagai starter kit asisten AI praktis untuk membersihkan, meringkas, dan mengekspor konten buku digital (ebook), catatan belajar, caption media sosial, dan produk informasi lainnya.
        """
    )
    
    with gr.Row():
        with gr.Column(scale=1):
            # Inputs
            input_text = gr.Textbox(
                label="Teks Mentah (Raw Text Input)", 
                placeholder="Tempelkan draf kasar, transkrip video, salinan web, atau teks berantakan Anda di sini...",
                lines=12
            )
            
            with gr.Row():
                mode_select = gr.Dropdown(
                    label="Mode Pemrosesan AI", 
                    choices=list(PROCESSING_MODES.keys()), 
                    value="Rangkuman Eksekutif (Executive Summary)"
                )
                format_select = gr.Dropdown(
                    label="Format Output Sasaran", 
                    choices=list(EXPORT_FORMATS.keys()), 
                    value="Markdown (.md)"
                )
            
            with gr.Accordion("Pengaturan Parameter Lanjutan (Optional)", open=False):
                min_len = gr.Slider(label="Minimum Panjang Rangkuman", minimum=50, maximum=500, value=150, step=10)
                max_len = gr.Slider(label="Maximum Panjang Rangkuman", minimum=500, maximum=2000, value=800, step=50)

            btn_submit = gr.Button("🚀 Mulai Pemrosesan Konten", variant="primary")

        with gr.Column(scale=1):
            # Outputs
            cleaned_out = gr.Textbox(
                label="Hasil Pembersihan Teks (Cleaned Output)", 
                interactive=False,
                lines=6
            )
            final_out = gr.Textbox(
                label="Hasil Rangkuman & Ekspor Akhir (Final Output)", 
                interactive=False,
                lines=10
            )

    # Trigger action
    btn_submit.click(
        fn=process_pipeline,
        inputs=[input_text, mode_select, format_select, min_len, max_len],
        outputs=[cleaned_out, final_out]
    )

    gr.Markdown(
        """
        ---
        **Keamanan & Kepatuhan Data:** Aplikasi ini berjalan lokal/serverless secara aman tanpa menyimpan data input Anda di penyimpanan permanen mana pun.  
        *&copy; 2026 Pusaka Media ID — All Rights Reserved.*
        """
    )

if __name__ == "__main__":
    # Launch locally or inside HF Spaces
    demo.queue().launch(server_name="0.0.0.0", server_port=7860)
