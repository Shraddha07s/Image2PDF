import io
from PIL import Image, ImageDraw, ImageFont
import img2pdf
from pypdf import PdfReader, PdfWriter, PageObject

# Standard Page Sizes in Points (72 dpi)
PAGE_SIZES = {
    'A4': (595.28, 841.89),      # 210 x 297 mm
    'Letter': (612.0, 792.0),    # 8.5 x 11 in
    'Original': None
}

# Margins in Points
MARGINS = {
    'none': 0,
    'small': 18,    # 0.25 in
    'medium': 36,   # 0.5 in
    'large': 54     # 0.75 in
}

# Quality Preset to JPEG Quality Percentage
QUALITY_PRESETS = {
    'high': 92,
    'medium': 75,
    'low': 50
}

def process_single_image(img, rotation=0, page_size_name='A4', orientation='portrait', margin_name='small', quality_preset='high', custom_compression=None):
    """
    Process an open PIL Image:
    1. Apply rotation
    2. Convert to RGB with white background (handling PNG alpha)
    3. Apply layout (Page size, Orientation, Margins)
    4. Compress & return JPEG image bytes
    """
    # 1. Apply Rotation
    if rotation and rotation % 360 != 0:
        # Pillow rotate is counter-clockwise, so negative for clockwise if needed
        # We assume rotation is passed in degrees (0, 90, 180, 270)
        img = img.rotate(-rotation, expand=True)

    # 2. Convert to RGB with white background for transparency
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1])
        img = background
    elif img.mode != 'RGB':
        img = img.convert('RGB')

    # Determine Quality percentage
    quality = 92
    if custom_compression is not None:
        try:
            quality = int(custom_compression)
            quality = max(10, min(100, quality))
        except (ValueError, TypeError):
            quality = QUALITY_PRESETS.get(quality_preset.lower(), 92)
    else:
        quality = QUALITY_PRESETS.get(quality_preset.lower(), 92)

    # 3. Layout fitting (Page size & Margins)
    page_dim = PAGE_SIZES.get(page_size_name, None)
    
    if page_dim is not None:
        target_width_pt, target_height_pt = page_dim
        
        # Adjust for orientation
        if orientation.lower() == 'landscape':
            if target_width_pt < target_height_pt:
                target_width_pt, target_height_pt = target_height_pt, target_width_pt
        else: # portrait
            if target_width_pt > target_height_pt:
                target_width_pt, target_height_pt = target_height_pt, target_width_pt

        margin_pt = MARGINS.get(margin_name.lower(), 18)
        
        # Available content area in points
        avail_w_pt = max(1, target_width_pt - (2 * margin_pt))
        avail_h_pt = max(1, target_height_pt - (2 * margin_pt))
        
        # Use 300 DPI for high quality layout rendering (1 pt = 300/72 pixels = 4.1666 pixels)
        scale_dpi = 300.0 / 72.0
        canvas_w_px = int(round(target_width_pt * scale_dpi))
        canvas_h_px = int(round(target_height_pt * scale_dpi))
        margin_px = int(round(margin_pt * scale_dpi))
        avail_w_px = canvas_w_px - (2 * margin_px)
        avail_h_px = canvas_h_px - (2 * margin_px)

        # Scale image keeping aspect ratio to fit inside avail_w_px x avail_h_px
        img_w, img_h = img.size
        ratio = min(avail_w_px / float(img_w), avail_h_px / float(img_h))
        new_w = max(1, int(round(img_w * ratio)))
        new_h = max(1, int(round(img_h * ratio)))

        resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Create final canvas
        canvas = Image.new('RGB', (canvas_w_px, canvas_h_px), (255, 255, 255))
        # Center the image in available area
        offset_x = margin_px + (avail_w_px - new_w) // 2
        offset_y = margin_px + (avail_h_px - new_h) // 2
        canvas.paste(resized_img, (offset_x, offset_y))
        final_img = canvas
    else:
        # Original size mode - apply margins if requested by expanding white border
        margin_pt = MARGINS.get(margin_name.lower(), 0)
        if margin_pt > 0:
            margin_px = int(round(margin_pt * (300.0 / 72.0)))
            w, h = img.size
            canvas = Image.new('RGB', (w + 2 * margin_px, h + 2 * margin_px), (255, 255, 255))
            canvas.paste(img, (margin_px, margin_px))
            final_img = canvas
        else:
            final_img = img

    # 4. Save to JPEG byte stream with requested quality
    buf = io.BytesIO()
    final_img.save(buf, format='JPEG', quality=quality, optimize=True)
    buf.seek(0)
    return buf.getvalue()

def generate_pdf_from_images(image_bytes_list, password=None, add_page_numbers=False):
    """
    Convert a list of JPEG image byte streams into a unified PDF.
    Optionally apply page numbers and password encryption.
    """
    if not image_bytes_list:
        raise ValueError("No images provided for PDF generation")

    # Generate raw PDF using img2pdf
    raw_pdf_bytes = img2pdf.convert(image_bytes_list)
    
    # If no post-processing needed, return raw PDF
    if not password and not add_page_numbers:
        return raw_pdf_bytes

    # Post-processing using pypdf
    pdf_reader = PdfReader(io.BytesIO(raw_pdf_bytes))
    pdf_writer = PdfWriter()
    
    total_pages = len(pdf_reader.pages)

    for i, page in enumerate(pdf_reader.pages):
        page_num = i + 1
        if add_page_numbers:
            # Create overlay canvas with page number
            overlay_bytes = create_page_number_overlay(
                width=float(page.mediabox.width),
                height=float(page.mediabox.height),
                current_page=page_num,
                total_pages=total_pages
            )
            if overlay_bytes:
                overlay_reader = PdfReader(io.BytesIO(overlay_bytes))
                page.merge_page(overlay_reader.pages[0])
        
        pdf_writer.add_page(page)

    # Password protection
    if password:
        pdf_writer.encrypt(user_password=password, owner_password=None, use_128bit=True)

    out_buf = io.BytesIO()
    pdf_writer.write(out_buf)
    out_buf.seek(0)
    return out_buf.getvalue()

def create_page_number_overlay(width, height, current_page, total_pages):
    """
    Creates a simple PDF overlay containing page numbers using Pillow and img2pdf.
    """
    try:
        # Create transparent canvas for page number text at 150 DPI
        dpi = 150
        scale = dpi / 72.0
        w_px = int(round(width * scale))
        h_px = int(round(height * scale))

        # Create white background image (since img2pdf turns it to page)
        img = Image.new('RGB', (w_px, h_px), (255, 255, 255))
        draw = ImageDraw.Draw(img)

        text = f"- Page {current_page} of {total_pages} -"
        font_size = int(round(12 * scale))
        
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

        # Bottom center text position
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_w = text_bbox[2] - text_bbox[0]
        text_h = text_bbox[3] - text_bbox[1]
        
        x = (w_px - text_w) // 2
        y = h_px - int(round(24 * scale)) - text_h

        draw.text((x, y), text, fill=(100, 100, 100), font=font)
        
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=95)
        buf.seek(0)
        return img2pdf.convert(buf.getvalue())
    except Exception:
        return None
