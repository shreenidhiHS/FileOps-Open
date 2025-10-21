import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface FlipResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  direction?: string;
  error?: string;
}

export const useFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Create preview for live flipping
  const createPreview = useCallback(async (file: File, direction: 'horizontal' | 'vertical'): Promise<string | null> => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;

      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply flip transformation
            if (direction === 'horizontal') {
              // Horizontal flip: scale(-1, 1) and translate
              ctx.scale(-1, 1);
              ctx.translate(-img.width, 0);
            } else {
              // Vertical flip: scale(1, -1) and translate
              ctx.scale(1, -1);
              ctx.translate(0, -img.height);
            }
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            
            // Convert to data URL for preview
            const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.8);
            resolve(dataUrl);
            
          } catch (error) {
            console.error('Preview error:', error);
            resolve(null);
          }
        };
        
        img.onerror = () => resolve(null);
        img.src = URL.createObjectURL(file);
      });
      
    } catch (error) {
      console.error('Preview creation error:', error);
      return null;
    }
  }, []);

  // Update preview when direction changes
  const updatePreview = useCallback(async (file: File, direction: 'horizontal' | 'vertical') => {
    const preview = await createPreview(file, direction);
    setPreviewDataUrl(preview);
  }, [createPreview]);

  const flipImage = useCallback(async (
    file: File, 
    direction: 'horizontal' | 'vertical'
  ): Promise<FlipResult> => {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    setIsFlipping(true);

    try {
      // Create a canvas to perform the flip
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Create an image element to load the file
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply flip transformation
            if (direction === 'horizontal') {
              // Horizontal flip: scale(-1, 1) and translate
              ctx.scale(-1, 1);
              ctx.translate(-img.width, 0);
            } else {
              // Vertical flip: scale(1, -1) and translate
              ctx.scale(1, -1);
              ctx.translate(0, -img.height);
            }
            
            // Draw the image
            ctx.drawImage(img, 0, 0);
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (!blob) {
                resolve({
                  success: false,
                  error: 'Failed to create flipped image'
                });
                return;
              }
              
              // Create data URL from blob
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;
                
                // Generate filename with flip info
                const fileExtension = file.name.split('.').pop() || 'jpg';
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                const fileName = `${fileNameWithoutExt}_flipped_${direction}.${fileExtension}`;
                
                resolve({
                  success: true,
                  dataUrl,
                  fileName,
                  direction
                });
              };
              reader.readAsDataURL(blob);
            }, file.type || 'image/jpeg', 0.9);
            
          } catch (error) {
            console.error('Flip error:', error);
            resolve({
              success: false,
              error: 'Failed to flip image'
            });
          }
        };
        
        img.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load image'
          });
        };
        
        // Load the image
        img.src = URL.createObjectURL(file);
      });
      
    } catch (error) {
      console.error('Flip error:', error);
      return {
        success: false,
        error: 'Failed to flip image'
      };
    } finally {
      setIsFlipping(false);
    }
  }, []);

  const downloadFlippedImage = useCallback((dataUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Flipped image downloaded!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download image");
    }
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return {
    isFlipping,
    previewDataUrl,
    flipImage,
    updatePreview,
    downloadFlippedImage,
    formatFileSize,
    setPreviewDataUrl
  };
};
