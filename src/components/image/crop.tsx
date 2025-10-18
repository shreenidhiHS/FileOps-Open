'use client'

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Image as ImageIcon, AlertCircle, Loader2, Crop, Maximize } from "lucide-react";
import { toast } from "sonner";

interface CropResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  cropArea?: { x: number; y: number; width: number; height: number };
  error?: string;
}

interface AspectRatio {
  name: string;
  ratio: number;
  width: number;
  height: number;
}

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [cropParams, setCropParams] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cropResult, setCropResult] = useState<CropResult | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const aspectRatios: AspectRatio[] = [
    { name: 'Free', ratio: 0, width: 0, height: 0 },
    { name: '1:1 (Square)', ratio: 1, width: 1, height: 1 },
    { name: '4:3 (Standard)', ratio: 4/3, width: 4, height: 3 },
    { name: '16:9 (Widescreen)', ratio: 16/9, width: 16, height: 9 },
    { name: '3:2 (Photo)', ratio: 3/2, width: 3, height: 2 },
    { name: '5:4 (Large Format)', ratio: 5/4, width: 5, height: 4 },
    { name: '21:9 (Ultrawide)', ratio: 21/9, width: 21, height: 9 }
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
      setCropResult(null);
      
      // Create image URL and get dimensions
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setCropParams({
          x: 0,
          y: 0,
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
      setCropResult(null);
      
      const url = URL.createObjectURL(droppedFile);
      setImageUrl(url);
      
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setCropParams({
          x: 0,
          y: 0,
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

  const handleAspectRatioChange = (value: string) => {
    setSelectedAspectRatio(value);
    if (value === 'free') return;
    
    const ratio = aspectRatios.find(r => r.name === value);
    if (ratio && imageDimensions) {
      const { width, height } = imageDimensions;
      const targetRatio = ratio.ratio;
      const currentRatio = width / height;
      
      let newWidth = width;
      let newHeight = height;
      
      if (currentRatio > targetRatio) {
        // Image is wider, fit to height
        newHeight = height;
        newWidth = Math.round(height * targetRatio);
      } else {
        // Image is taller, fit to width
        newWidth = width;
        newHeight = Math.round(width / targetRatio);
      }
      
      setCropParams({
        x: Math.round((width - newWidth) / 2),
        y: Math.round((height - newHeight) / 2),
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleCropParamChange = (param: keyof typeof cropParams, value: number) => {
    if (!imageDimensions) return;
    
    const newParams = { ...cropParams, [param]: value };
    
    // Validate bounds
    if (param === 'x') {
      newParams.x = Math.max(0, Math.min(value, imageDimensions.width - newParams.width));
    } else if (param === 'y') {
      newParams.y = Math.max(0, Math.min(value, imageDimensions.height - newParams.height));
    } else if (param === 'width') {
      newParams.width = Math.max(1, Math.min(value, imageDimensions.width - newParams.x));
    } else if (param === 'height') {
      newParams.height = Math.max(1, Math.min(value, imageDimensions.height - newParams.y));
    }
    
    setCropParams(newParams);
  };

  const cropImage = async () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    if (cropParams.width <= 0 || cropParams.height <= 0) {
      toast.error("Please set valid crop dimensions");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('x', cropParams.x.toString());
      formData.append('y', cropParams.y.toString());
      formData.append('width', cropParams.width.toString());
      formData.append('height', cropParams.height.toString());

      const response = await fetch('/api/image/crop', {
        method: 'POST',
        body: formData,
      });

      const result: CropResult = await response.json();

      if (result.success && result.dataUrl) {
        setCropResult(result);
        toast.success("Image cropped successfully!");
      } else {
        toast.error(result.error || "Failed to crop image");
      }
    } catch (error) {
      console.error('Crop error:', error);
      toast.error("Failed to crop image file");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCroppedImage = () => {
    if (!cropResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = cropResult.dataUrl;
    link.download = cropResult.fileName || 'cropped.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Cropped image downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Image Cropper
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Crop images to specific dimensions or aspect ratios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Crop Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image & Crop Settings
              </CardTitle>
              <CardDescription>
                Select an image file and configure crop parameters
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
                      Dimensions:
                    </span>
                    <Badge variant="outline">
                      {imageDimensions.width} × {imageDimensions.height}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Aspect Ratio Selection */}
              {imageDimensions && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Aspect Ratio:
                    </Label>
                    <Select value={selectedAspectRatio} onValueChange={handleAspectRatioChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select aspect ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.name} value={ratio.name}>
                            {ratio.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Crop Parameters */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        X Position:
                      </Label>
                      <Input
                        type="number"
                        value={cropParams.x}
                        onChange={(e) => handleCropParamChange('x', parseInt(e.target.value) || 0)}
                        min={0}
                        max={imageDimensions?.width || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Y Position:
                      </Label>
                      <Input
                        type="number"
                        value={cropParams.y}
                        onChange={(e) => handleCropParamChange('y', parseInt(e.target.value) || 0)}
                        min={0}
                        max={imageDimensions?.height || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Width:
                      </Label>
                      <Input
                        type="number"
                        value={cropParams.width}
                        onChange={(e) => handleCropParamChange('width', parseInt(e.target.value) || 0)}
                        min={1}
                        max={imageDimensions?.width || 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Height:
                      </Label>
                      <Input
                        type="number"
                        value={cropParams.height}
                        onChange={(e) => handleCropParamChange('height', parseInt(e.target.value) || 0)}
                        min={1}
                        max={imageDimensions?.height || 0}
                      />
                    </div>
                  </div>

                  {/* Crop Preview */}
                  {imageUrl && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Crop Preview:
                      </Label>
                      <div className="relative border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                        <img
                          src={imageUrl}
                          alt="Crop preview"
                          className="w-full h-48 object-contain"
                          style={{ backgroundColor: 'var(--muted)' }}
                        />
                        <div
                          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                          style={{
                            left: `${(cropParams.x / imageDimensions.width) * 100}%`,
                            top: `${(cropParams.y / imageDimensions.height) * 100}%`,
                            width: `${(cropParams.width / imageDimensions.width) * 100}%`,
                            height: `${(cropParams.height / imageDimensions.height) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Crop Button */}
              <Button
                onClick={cropImage}
                disabled={!file || !imageDimensions || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cropping Image...
                  </>
                ) : (
                  <>
                    <Crop className="w-4 h-4 mr-2" />
                    Crop Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Crop Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cropped Result
              </CardTitle>
              <CardDescription>
                Your cropped image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cropResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {cropResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Crop Area:
                      </span>
                      <Badge variant="outline">
                        {cropResult.cropArea?.width} × {cropResult.cropArea?.height}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadCroppedImage}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {cropResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={cropResult.dataUrl}
                        alt="Cropped image preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image file to start cropping
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
                  Select the image file you want to crop
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Set Parameters</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Choose aspect ratio or set custom dimensions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your cropped image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
