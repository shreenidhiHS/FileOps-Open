'use client'

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Image as ImageIcon, AlertCircle, Loader2, Maximize, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ResizeResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  originalWidth?: number;
  originalHeight?: number;
  newWidth?: number;
  newHeight?: number;
  error?: string;
}

interface PresetSize {
  name: string;
  width: number;
  height: number;
  description: string;
}

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [resizeParams, setResizeParams] = useState({
    width: 0,
    height: 0
  });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);

  const presetSizes: PresetSize[] = [
    { name: 'Custom', width: 0, height: 0, description: 'Set custom dimensions' },
    { name: 'Thumbnail', width: 150, height: 150, description: '150 × 150px' },
    { name: 'Small', width: 300, height: 300, description: '300 × 300px' },
    { name: 'Medium', width: 600, height: 600, description: '600 × 600px' },
    { name: 'Large', width: 1200, height: 1200, description: '1200 × 1200px' },
    { name: 'HD', width: 1920, height: 1080, description: '1920 × 1080px (16:9)' },
    { name: '4K', width: 3840, height: 2160, description: '3840 × 2160px (4K)' },
    { name: 'Instagram Square', width: 1080, height: 1080, description: '1080 × 1080px' },
    { name: 'Instagram Story', width: 1080, height: 1920, description: '1080 × 1920px' },
    { name: 'Facebook Cover', width: 1200, height: 630, description: '1200 × 630px' },
    { name: 'Twitter Header', width: 1500, height: 500, description: '1500 × 500px' },
    { name: 'LinkedIn Banner', width: 1584, height: 396, description: '1584 × 396px' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setResizeResult(null);
      
      // Create image URL and get dimensions
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setResizeParams({
          width: img.width,
          height: img.height
        });
      };
      img.src = url;
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith('image/')) {
        toast.error("Please drop an image file");
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(droppedFile);
      setResizeResult(null);
      
      const url = URL.createObjectURL(droppedFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setResizeParams({
          width: img.width,
          height: img.height
        });
      };
      img.src = url;
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    if (value === 'custom') return;
    
    const preset = presetSizes.find(p => p.name === value);
    if (preset && imageDimensions) {
      if (maintainAspectRatio) {
        const aspectRatio = imageDimensions.width / imageDimensions.height;
        let newWidth = preset.width;
        let newHeight = preset.height;
        
        if (preset.width > 0 && preset.height > 0) {
          // Both dimensions specified, fit to maintain aspect ratio
          const targetRatio = preset.width / preset.height;
          if (aspectRatio > targetRatio) {
            newHeight = Math.round(preset.width / aspectRatio);
          } else {
            newWidth = Math.round(preset.height * aspectRatio);
          }
        } else if (preset.width > 0) {
          // Only width specified
          newHeight = Math.round(preset.width / aspectRatio);
        } else if (preset.height > 0) {
          // Only height specified
          newWidth = Math.round(preset.height * aspectRatio);
        }
        
        setResizeParams({ width: newWidth, height: newHeight });
      } else {
        setResizeParams({ width: preset.width, height: preset.height });
      }
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (!imageDimensions) return;
    
    const newParams = { ...resizeParams, [dimension]: value };
    
    if (maintainAspectRatio) {
      const aspectRatio = imageDimensions.width / imageDimensions.height;
      if (dimension === 'width') {
        newParams.height = Math.round(value / aspectRatio);
      } else {
        newParams.width = Math.round(value * aspectRatio);
      }
    }
    
    setResizeParams(newParams);
  };

  const resetToOriginal = () => {
    if (imageDimensions) {
      setResizeParams({
        width: imageDimensions.width,
        height: imageDimensions.height
      });
      setSelectedPreset('custom');
    }
  };

  const resizeImage = async () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    if (resizeParams.width <= 0 || resizeParams.height <= 0) {
      toast.error("Please set valid dimensions");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', resizeParams.width.toString());
      formData.append('height', resizeParams.height.toString());
      formData.append('maintainAspectRatio', maintainAspectRatio.toString());

      const response = await fetch('/api/image/resize', {
        method: 'POST',
        body: formData,
      });

      const result: ResizeResult = await response.json();

      if (result.success && result.dataUrl) {
        setResizeResult(result);
        toast.success("Image resized successfully!");
      } else {
        toast.error(result.error || "Failed to resize image");
      }
    } catch (error) {
      console.error('Resize error:', error);
      toast.error("Failed to resize image file");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResizedImage = () => {
    if (!resizeResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = resizeResult.dataUrl;
    link.download = resizeResult.fileName || 'resized.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Resized image downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate aspect ratio
  const aspectRatio = imageDimensions ? imageDimensions.width / imageDimensions.height : 1;
  const newAspectRatio = resizeParams.width > 0 && resizeParams.height > 0 ? resizeParams.width / resizeParams.height : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Image Resizer
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Resize images to specific dimensions with quality control
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Resize Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image & Resize Settings
              </CardTitle>
              <CardDescription>
                Select an image file and configure resize parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-opacity-50 transition-colors duration-200 cursor-pointer"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--muted)'
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <ImageIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Image files up to 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* File Info */}
              {file && imageDimensions && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      File Name:
                    </span>
                    <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      File Size:
                    </span>
                    <Badge variant="secondary">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Original Dimensions:
                    </span>
                    <Badge variant="outline">
                      {imageDimensions.width} × {imageDimensions.height}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Aspect Ratio:
                    </span>
                    <Badge variant="outline">
                      {aspectRatio.toFixed(2)}:1
                    </Badge>
                  </div>
                </div>
              )}

              {/* Resize Settings */}
              {imageDimensions && (
                <div className="space-y-4">
                  {/* Preset Sizes */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Quick Presets:
                    </Label>
                    <Select value={selectedPreset} onValueChange={handlePresetChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a preset size" />
                      </SelectTrigger>
                      <SelectContent>
                        {presetSizes.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name} - {preset.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aspect Ratio Toggle */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="maintain-aspect"
                      checked={maintainAspectRatio}
                      onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
                    />
                    <Label htmlFor="maintain-aspect" className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Maintain aspect ratio
                    </Label>
                  </div>

                  {/* Custom Dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Width (px):
                      </Label>
                      <Input
                        type="number"
                        value={resizeParams.width}
                        onChange={(e) => handleDimensionChange('width', parseInt(e.target.value) || 0)}
                        min={1}
                        max={10000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Height (px):
                      </Label>
                      <Input
                        type="number"
                        value={resizeParams.height}
                        onChange={(e) => handleDimensionChange('height', parseInt(e.target.value) || 0)}
                        min={1}
                        max={10000}
                      />
                    </div>
                  </div>

                  {/* New Dimensions Info */}
                  <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        New Dimensions:
                      </span>
                      <Badge variant="outline">
                        {resizeParams.width} × {resizeParams.height}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        New Aspect Ratio:
                      </span>
                      <Badge variant="outline">
                        {newAspectRatio.toFixed(2)}:1
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Size Change:
                      </span>
                      <Badge variant={resizeParams.width < imageDimensions.width ? "default" : "destructive"}>
                        {resizeParams.width < imageDimensions.width ? "Smaller" : "Larger"}
                      </Badge>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <Button
                    variant="outline"
                    onClick={resetToOriginal}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Original Size
                  </Button>
                </div>
              )}

              {/* Resize Button */}
              <Button
                onClick={resizeImage}
                disabled={!file || !imageDimensions || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resizing Image...
                  </>
                ) : (
                  <>
                    <Maximize className="w-4 h-4 mr-2" />
                    Resize Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resize Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Resized Result
              </CardTitle>
              <CardDescription>
                Your resized image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resizeResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {resizeResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Original Size:
                      </span>
                      <Badge variant="outline">
                        {resizeResult.originalWidth} × {resizeResult.originalHeight}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        New Size:
                      </span>
                      <Badge variant="default">
                        {resizeResult.newWidth} × {resizeResult.newHeight}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadResizedImage}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {resizeResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={resizeResult.dataUrl}
                        alt="Resized image preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image file to start resizing
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>1</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Upload Image</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select the image file you want to resize
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Set Dimensions</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Choose preset sizes or set custom dimensions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your resized image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}