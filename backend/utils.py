import os
import re
from werkzeug.utils import secure_filename
from PIL import Image, ImageOps
from config import ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES

def allowed_file(filename):
    """Check if file extension is allowed."""
    if not filename or '.' not in filename:
        return False
    ext = filename.rsplit('.', 1)[1].lower()
    return ext in ALLOWED_EXTENSIONS

def validate_and_open_image(file_storage):
    """
    Validate file extension, MIME type, and attempt to open using Pillow to verify image validity.
    Returns: (image_object, error_message)
    """
    filename = file_storage.filename
    if not filename:
        return None, "File has no filename"

    if not allowed_file(filename):
        return None, f"Unsupported file extension in file: '{filename}'. Allowed: JPG, JPEG, PNG, WEBP."

    try:
        # Seek to start of file
        file_storage.stream.seek(0)
        img = Image.open(file_storage.stream)
        
        # Verify format
        img_format = (img.format or "").lower()
        if img_format not in ['jpeg', 'png', 'webp', 'jpg']:
            return None, f"Invalid image format '{img.format}' in file: '{filename}'"

        # Load image into memory to check corruption
        img.verify()
        
        # Re-open stream after verify() as verify renders the stream un-usable
        file_storage.stream.seek(0)
        img = Image.open(file_storage.stream)
        
        # Correct image orientation according to EXIF tags if present
        img = ImageOps.exif_transpose(img)

        return img, None
    except Exception as e:
        return None, f"Corrupted or invalid image file '{filename}': {str(e)}"

def sanitize_pdf_filename(name):
    """Sanitize custom PDF filename and ensure .pdf extension."""
    if not name or not name.strip():
        return "converted.pdf"
    
    clean_name = secure_filename(name.strip())
    if not clean_name:
        clean_name = "converted"
    
    # Remove existing extension if any, then append .pdf
    clean_name = re.sub(r'\.[a-zA-Z0-9]+$', '', clean_name)
    return f"{clean_name}.pdf"

def cleanup_files(file_paths):
    """Safely remove a list of file paths."""
    for path in file_paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass
