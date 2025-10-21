import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface RotateResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  degrees?: number;
  error?: string;
}

export const useRotate = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Create preview for live rotation
  const createPreview = useCallback(async (file: File, degrees: number): Promise<string | null> => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;

      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // Calculate new dimensions based on rotation
            let newWidth = img.width;
            let newHeight = img.height;
            
            // For 90° and 270° rotations, swap width and height
            if (degrees === 90 || degrees === 270) {
              newWidth = img.height;
              newHeight = img.width;
            }
            
            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // Move to center of canvas
            ctx.translate(newWidth / 2, newHeight / 2);
            
            // Rotate the canvas
            ctx.rotate((degrees * Math.PI) / 180);
            
            // Draw the image centered
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
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

  // Update preview when degrees change
  const updatePreview = useCallback(async (file: File, degrees: number) => {
    const preview = await createPreview(file, degrees);
    setPreviewDataUrl(preview);
  }, [createPreview]);

  const rotateImage = useCallback(async (
    file: File, 
    degrees: number
  ): Promise<RotateResult> => {
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    setIsRotating(true);

    try {
      // Create a canvas to perform the rotation
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
            // Calculate new dimensions based on rotation
            let newWidth = img.width;
            let newHeight = img.height;
            
            // For 90° and 270° rotations, swap width and height
            if (degrees === 90 || degrees === 270) {
              newWidth = img.height;
              newHeight = img.width;
            }
            
            // Set canvas dimensions
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            // Move to center of canvas
            ctx.translate(newWidth / 2, newHeight / 2);
            
            // Rotate the canvas
            ctx.rotate((degrees * Math.PI) / 180);
            
            // Draw the image centered
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            // Convert canvas to blob
            canvas.toBlob((blob) => {
              if (!blob) {
                resolve({
                  success: false,
                  error: 'Failed to create rotated image'
                });
                return;
              }
              
              // Create data URL from blob
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = reader.result as string;
                
                // Generate filename with rotation info
                const fileExtension = file.name.split('.').pop() || 'jpg';
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
                const fileName = `${fileNameWithoutExt}_rotated_${degrees}deg.${fileExtension}`;
                
                resolve({
                  success: true,
                  dataUrl,
                  fileName,
                  degrees
                });
              };
              reader.readAsDataURL(blob);
            }, file.type || 'image/jpeg', 0.9);
            
          } catch (error) {
            console.error('Rotation error:', error);
            resolve({
              success: false,
              error: 'Failed to rotate image'
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
      console.error('Rotation error:', error);
      return {
        success: false,
        error: 'Failed to rotate image'
      };
    } finally {
      setIsRotating(false);
    }
  }, []);

  const downloadRotatedImage = useCallback((dataUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Rotated image downloaded!");
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
    isRotating,
    previewDataUrl,
    rotateImage,
    updatePreview,
    downloadRotatedImage,
    formatFileSize,
    setPreviewDataUrl
  };
};
