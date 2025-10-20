'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, Image as ImageIcon, AlertCircle, Loader2, FlipHorizontal, FlipVertical } from "lucide-react";
import { toast } from "sonner";
import { useFlip } from "./hooks/useFlip";

interface FlipResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  direction?: string;
  error?: string;
}

export default function FlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [flipResult, setFlipResult] = useState<FlipResult | null>(null);
  
  const { 
    isFlipping, 
    previewDataUrl, 
    flipImage, 
    updatePreview, 
    downloadFlippedImage, 
    formatFileSize,
    setPreviewDataUrl 
  } = useFlip();

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
      setFlipResult(null);
      setPreviewDataUrl(null);
      // Generate initial preview
      updatePreview(selectedFile, direction);
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
      setFlipResult(null);
      setPreviewDataUrl(null);
      // Generate initial preview
      updatePreview(droppedFile, direction);
    }
  }, [direction, updatePreview]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDirectionChange = useCallback((newDirection: 'horizontal' | 'vertical') => {
    setDirection(newDirection);
    if (file) {
      updatePreview(file, newDirection);
    }
  }, [file, updatePreview]);

  const handleFlipImage = async () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const result = await flipImage(file, direction);

      if (result.success && result.dataUrl) {
        setFlipResult(result);
        toast.success(`Image flipped ${direction}ly successfully!`);
      } else {
        toast.error(result.error || "Failed to flip image");
      }
    } catch (error) {
      console.error('Flip error:', error);
      toast.error("Failed to flip image file");
    }
  };

  const handleDownloadFlippedImage = () => {
    if (!flipResult?.dataUrl || !flipResult?.fileName) return;
    downloadFlippedImage(flipResult.dataUrl, flipResult.fileName);
  };


  const flipOptions = [
    { 
      value: 'horizontal' as const, 
      label: 'Horizontal Flip', 
      description: 'Flip left to right (mirror effect)',
      icon: FlipHorizontal
    },
    { 
      value: 'vertical' as const, 
      label: 'Vertical Flip', 
      description: 'Flip top to bottom (upside down)',
      icon: FlipVertical
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Image Flipper
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Flip images horizontally or vertically to create mirror effects
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* File Upload & Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image & Settings
              </CardTitle>
              <CardDescription>
                Select an image file and choose flip direction
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
              {file && (
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
                </div>
              )}

              {/* Flip Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Flip Direction:
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {flipOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <Button
                          key={option.value}
                          variant={direction === option.value ? "default" : "outline"}
                          onClick={() => handleDirectionChange(option.value)}
                          className="justify-start h-auto p-4"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="w-5 h-5" />
                            <div className="text-left">
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs opacity-70">{option.description}</div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Current Selection */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <strong>Selected:</strong> {flipOptions.find(opt => opt.value === direction)?.label}
                  </div>
                </div>
              </div>

              {/* Flip Button */}
              <Button
                onClick={handleFlipImage}
                disabled={!file || isFlipping}
                className="w-full"
                size="lg"
              >
                {isFlipping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Flipping Image...
                  </>
                ) : (
                  <>
                    {direction === 'horizontal' ? (
                      <FlipHorizontal className="w-4 h-4 mr-2" />
                    ) : (
                      <FlipVertical className="w-4 h-4 mr-2" />
                    )}
                    Flip Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Live Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                See how your image will look after flipping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewDataUrl ? (
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <img
                    src={previewDataUrl}
                    alt="Flip preview"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image to see live preview
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flip Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Flip Results
              </CardTitle>
              <CardDescription>
                Your flipped image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {flipResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {flipResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Direction:
                      </span>
                      <Badge variant="outline">
                        {flipResult.direction === 'horizontal' ? 'Horizontal' : 'Vertical'}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadFlippedImage}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {flipResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={flipResult.dataUrl}
                        alt="Flipped image preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image file to see flip results
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
                  Select the image file you want to flip
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Choose Direction</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select horizontal or vertical flip
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your flipped image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
