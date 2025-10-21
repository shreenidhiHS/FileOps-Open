import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface ColorAdjustments {
  brightness: number; // range: -100..100, 0 means no change
  contrast: number;   // range: -100..100, 0 means no change
  saturation: number; // range: -100..100, 0 means no change
  hue: number;        // range: -180..180, 0 means no change (degrees)
}

interface ExportOptions {
  mimeType?: string; // e.g. 'image/png' | 'image/jpeg'
  quality?: number;  // 0..1 for image/jpeg
}

export const useColorAdjust = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [fileName, setFileName] = useState<string>('image');
  const [adjustments, setAdjustments] = useState<ColorAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0
  });

  const loadFile = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      imageRef.current = img;
      setHasImage(true);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '') || 'image';
      setFileName(nameWithoutExt);

      // Draw initially with current adjustments
      requestAnimationFrame(() => {
        applyToCanvas();
      });
    } catch (error) {
      console.error('Image load error:', error);
      toast.error('Failed to load image');
      setHasImage(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches image natural size
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Map UI ranges to CSS filter values
    const brightnessFactor = 1 + adjustments.brightness / 100; // 0 -> 1, 100 -> 2, -100 -> 0
    const contrastFactor = 1 + adjustments.contrast / 100;
    const saturationFactor = 1 + adjustments.saturation / 100;
    const hueDegrees = adjustments.hue; // already in degrees

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightnessFactor}) contrast(${contrastFactor}) saturate(${saturationFactor}) hue-rotate(${hueDegrees}deg)`;
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  }, [adjustments]);

  // Re-apply whenever adjustments change
  useEffect(() => {
    if (hasImage) {
      applyToCanvas();
    }
  }, [hasImage, adjustments, applyToCanvas]);

  const updateAdjustment = useCallback(
    (property: keyof ColorAdjustments, value: number) => {
      setAdjustments(prev => ({ ...prev, [property]: value }));
    },
    []
  );

  const resetAdjustments = useCallback(() => {
    setAdjustments({ brightness: 0, contrast: 0, saturation: 0, hue: 0 });
  }, []);

  const exportDataUrl = useCallback((options?: ExportOptions) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const mimeType = options?.mimeType || 'image/jpeg';
    const quality = options?.quality ?? 0.92;
    try {
      return canvas.toDataURL(mimeType, quality);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to generate image');
      return null;
    }
  }, []);

  const downloadAdjustedImage = useCallback((options?: ExportOptions) => {
    const dataUrl = exportDataUrl(options);
    if (!dataUrl) return;
    try {
      const ext = (options?.mimeType === 'image/png') ? 'png' : 'jpg';
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileName}_color-adjusted.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  }, [exportDataUrl, fileName]);

  return {
    // state
    isLoading,
    hasImage,
    fileName,
    adjustments,

    // refs
    canvasRef,

    // actions
    loadFile,
    updateAdjustment,
    resetAdjustments,
    applyToCanvas,
    exportDataUrl,
    downloadAdjustedImage,
    setAdjustments
  };
};


