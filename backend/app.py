import json
import io
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from config import PORT, HOST, DEBUG, CORS_ORIGINS, MAX_CONTENT_LENGTH
from utils import validate_and_open_image, sanitize_pdf_filename
from converter import process_single_image, generate_pdf_from_images

app = Flask(__name__)

# Max upload limit
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Enable CORS for frontend requests
CORS(app, resources={r"/*": {"origins": CORS_ORIGINS}}, expose_headers=["Content-Disposition"])

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "status": "Backend Running",
        "message": "Image2PDF API is operational",
        "version": "1.0.0"
    }), 200

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route("/convert", methods=["POST"])
@app.route("/api/convert", methods=["POST"])
def convert_images_to_pdf():
    try:
        # Check if files exist in request
        if 'images' not in request.files and 'images[]' not in request.files:
            return jsonify({"error": "No images provided in upload payload"}), 400

        files = request.files.getlist('images') or request.files.getlist('images[]')
        
        if not files or all(f.filename == '' for f in files):
            return jsonify({"error": "No files selected for upload"}), 400

        # Parse options from form data
        page_size = request.form.get('pageSize', 'A4')
        orientation = request.form.get('orientation', 'portrait')
        margin = request.form.get('margin', 'small')
        quality = request.form.get('quality', 'high')
        custom_compression = request.form.get('compressionLevel', None)
        pdf_filename = sanitize_pdf_filename(request.form.get('filename', 'converted.pdf'))
        password = request.form.get('password', '').strip() or None
        add_page_numbers = request.form.get('pageNumbers', 'false').lower() in ('true', '1', 'yes')

        # Parse rotations array if provided
        rotations_str = request.form.get('rotations', '[]')
        try:
            rotations = json.loads(rotations_str)
        except Exception:
            rotations = []

        processed_images = []

        for idx, file_item in enumerate(files):
            if file_item.filename == '':
                continue

            # Validate and open image
            img, err = validate_and_open_image(file_item)
            if err or img is None:
                return jsonify({"error": err or f"Invalid image file at index {idx}"}), 400

            # Get rotation for current image
            rot = 0
            if idx < len(rotations):
                try:
                    rot = int(rotations[idx])
                except (ValueError, TypeError):
                    rot = 0

            # Process image (resizing, orientation, background white fill, compression)
            img_bytes = process_single_image(
                img=img,
                rotation=rot,
                page_size_name=page_size,
                orientation=orientation,
                margin_name=margin,
                quality_preset=quality,
                custom_compression=custom_compression
            )
            processed_images.append(img_bytes)

        if not processed_images:
            return jsonify({"error": "No valid images could be processed"}), 400

        # Generate combined PDF
        pdf_bytes = generate_pdf_from_images(
            image_bytes_list=processed_images,
            password=password,
            add_page_numbers=add_page_numbers
        )

        # Return downloadable PDF
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=pdf_filename
        )

    except Exception as e:
        app.logger.error(f"Conversion error: {str(e)}")
        return jsonify({"error": f"An unexpected error occurred during PDF conversion: {str(e)}"}), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "Total payload size exceeds maximum upload limit of 50 MB"}), 413

if __name__ == "__main__":
    app.run(host=HOST, port=PORT, debug=DEBUG)
