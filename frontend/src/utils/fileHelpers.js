/**
 * Format bytes to readable size string
 */
export const formatBytes = (bytes, decimals = 1) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Get image width and height asynchronously
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
    img.src = url;
  });
};

/**
 * Estimate final PDF file size based on image sizes, count, and quality settings
 */
export const calculateEstimatedPdfSize = (images, settings) => {
  if (!images || images.length === 0) return '0 Bytes';
  
  const totalOriginalBytes = images.reduce((acc, item) => acc + (item.file?.size || 0), 0);
  
  // Compression factor based on quality setting or slider
  let factor = 0.85; // high
  if (settings.compressionLevel) {
    factor = (settings.compressionLevel / 100) * 0.9;
  } else if (settings.quality === 'medium') {
    factor = 0.6;
  } else if (settings.quality === 'low') {
    factor = 0.35;
  }

  const estimatedBytes = Math.round(totalOriginalBytes * factor) + (images.length * 2048); // PDF header overhead
  return formatBytes(estimatedBytes);
};

/**
 * Validate single file client-side
 */
export const validateFile = (file) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const maxSizeBytes = 25 * 1024 * 1024; // 25 MB per file limit

  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, message: `File "${file.name}" has an unsupported format (${ext.toUpperCase()}). Allowed formats: JPG, JPEG, PNG, WEBP.` };
  }

  if (file.size > maxSizeBytes) {
    return { valid: false, message: `File "${file.name}" exceeds the maximum 25 MB size limit (${formatBytes(file.size)}).` };
  }

  return { valid: true };
};

/**
 * Helper to download Blob as file
 */
export const downloadBlob = (blob, filename = 'converted.pdf') => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};
