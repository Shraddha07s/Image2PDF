import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { validateFile, getImageDimensions, downloadBlob } from '../utils/fileHelpers';
import { convertImagesToPDF } from '../services/api';

export const useImageConverter = () => {
  // Always dark theme for PageForge professional IDE feel
  const [theme] = useState('dark');

  // Images state array
  const [images, setImages] = useState([]);

  // Settings state
  const [settings, setSettings] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 'small',
    quality: 'high',
    compressionLevel: 85,
    filename: 'converted.pdf',
    password: '',
    pageNumbers: false,
  });

  // Conversion & UI state
  const [isConverting, setIsConverting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfResult, setPdfResult] = useState(null); // { blob, url, filename }
  const [previewZoomImage, setPreviewZoomImage] = useState(null); // single image for zoom modal
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('pageforge_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Keep dark class on HTML root
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Sync history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pageforge_history', JSON.stringify(history.slice(0, 10)));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, [history]);

  // Add multiple files
  const addImages = useCallback(async (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const validItems = [];
    const errors = [];

    for (const file of newFiles) {
      const check = validateFile(file);
      if (!check.valid) {
        errors.push(check.message);
        continue;
      }

      const dimensions = await getImageDimensions(file);
      const uniqueId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);

      validItems.push({
        id: uniqueId,
        file,
        name: file.name,
        size: file.size,
        previewUrl,
        rotation: 0, // 0, 90, 180, 270 degrees
        width: dimensions.width,
        height: dimensions.height,
      });
    }

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err, { duration: 4000 }));
    }

    if (validItems.length > 0) {
      setImages((prev) => [...prev, ...validItems]);
      toast.success(`Imported ${validItems.length} page${validItems.length > 1 ? 's' : ''}`);
    }
  }, []);

  // Duplicate an existing page
  const duplicateImage = useCallback((id) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index === -1) return prev;

      const source = prev[index];
      const newId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      const copy = {
        ...source,
        id: newId,
        name: `${source.name.replace(/(\.[^.]+)$/, '')} (Copy)${source.name.match(/\.[^.]+$/)?.[0] || ''}`,
      };

      const updated = [...prev];
      updated.splice(index + 1, 0, copy);
      return updated;
    });
    toast.success('Page duplicated');
  }, []);

  // Remove single image
  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const itemToRemove = prev.find((img) => img.id === id);
      if (itemToRemove && itemToRemove.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
    toast.success('Page removed');
  }, []);

  // Clear all images
  const clearAllImages = useCallback(() => {
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    setPdfResult(null);
    toast.success('All pages cleared');
  }, [images]);

  // Rotate single image (clockwise or counter-clockwise)
  const rotateImage = useCallback((id, direction = 'clockwise') => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const delta = direction === 'clockwise' ? 90 : -90;
          let newRot = (img.rotation + delta) % 360;
          if (newRot < 0) newRot += 360;
          return { ...img, rotation: newRot };
        }
        return img;
      })
    );
  }, []);

  // Reorder images list
  const reorderImages = useCallback((newOrderedImages) => {
    setImages(newOrderedImages);
  }, []);

  // Update setting value
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset settings to default
  const resetSettings = useCallback(() => {
    setSettings({
      pageSize: 'A4',
      orientation: 'portrait',
      margin: 'small',
      quality: 'high',
      compressionLevel: 85,
      filename: 'converted.pdf',
      password: '',
      pageNumbers: false,
    });
    toast.success('Settings reset');
  }, []);

  // Trigger Conversion API
  const convert = useCallback(async () => {
    if (images.length === 0) {
      toast.error('Add at least one image to compile PDF');
      return;
    }

    setIsConverting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      images.forEach((img) => {
        formData.append('images', img.file);
      });

      const rotations = images.map((img) => img.rotation);
      formData.append('rotations', JSON.stringify(rotations));

      formData.append('pageSize', settings.pageSize);
      formData.append('orientation', settings.orientation);
      formData.append('margin', settings.margin);
      formData.append('quality', settings.quality);
      if (settings.compressionLevel) {
        formData.append('compressionLevel', settings.compressionLevel);
      }
      formData.append('filename', settings.filename || 'converted.pdf');
      if (settings.password) {
        formData.append('password', settings.password);
      }
      formData.append('pageNumbers', settings.pageNumbers ? 'true' : 'false');

      const result = await convertImagesToPDF(formData, (progress) => {
        setUploadProgress(progress);
      });

      const blobUrl = URL.createObjectURL(result.blob);
      const pdfObj = {
        blob: result.blob,
        url: blobUrl,
        filename: result.filename,
        size: result.blob.size,
        timestamp: new Date().toISOString(),
        imageCount: images.length,
      };

      setPdfResult(pdfObj);

      setHistory((prev) => [
        {
          id: `hist-${Date.now()}`,
          filename: pdfObj.filename,
          imageCount: pdfObj.imageCount,
          size: pdfObj.size,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);

      toast.success('PDF compiled successfully!');
    } catch (error) {
      console.error('Conversion failed:', error);
      toast.error(error.message || 'PDF compilation failed.');
    } finally {
      setIsConverting(false);
    }
  }, [images, settings]);

  // Download PDF
  const handleDownload = useCallback(() => {
    if (pdfResult && pdfResult.blob) {
      downloadBlob(pdfResult.blob, pdfResult.filename);
      toast.success('Downloading PDF');
    }
  }, [pdfResult]);

  return {
    theme,
    images,
    addImages,
    duplicateImage,
    removeImage,
    clearAllImages,
    rotateImage,
    reorderImages,
    settings,
    updateSetting,
    resetSettings,
    isConverting,
    uploadProgress,
    pdfResult,
    setPdfResult,
    previewZoomImage,
    setPreviewZoomImage,
    convert,
    handleDownload,
    history,
  };
};
