import axios from 'axios';

// Get base URL from environment or default to local Flask dev server
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for large conversions
});

/**
 * Check backend health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

/**
 * Convert images to PDF
 * @param {FormData} formData 
 * @param {Function} onUploadProgress 
 */
export const convertImagesToPDF = async (formData, onUploadProgress) => {
  try {
    const response = await apiClient.post('/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onUploadProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });

    // Extract filename from Content-Disposition header if present
    let filename = 'converted.pdf';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    return {
      blob: response.data,
      filename: filename,
    };
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      // Parse blob error message into text
      const text = await error.response.data.text();
      try {
        const jsonError = JSON.parse(text);
        throw new Error(jsonError.error || 'Conversion failed');
      } catch (e) {
        throw new Error(text || 'Conversion failed');
      }
    }
    throw new Error(error.response?.data?.error || error.message || 'Server unavailable or connection error');
  }
};
