'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Upload, Download, Image as ImageIcon, AlertCircle, Loader2, Palette, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface ColorAdjustResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hue?: number;
  };
  error?: string;
}

export default function ColorAdjustImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adjustResult, setAdjustResult] = useState<ColorAdjustResult | null>(null);
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hue: 0
  });

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
      setAdjustResult(null);
      
      // Create image URL
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
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
      setAdjustResult(null);
      
      const url = URL.createObjectURL(droppedFile);
      setImageUrl(url);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleAdjustmentChange = (property: keyof typeof adjustments, value: number[]) => {
    setAdjustments(prev => ({
      ...prev,
      [property]: value[0]
    }));
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hue: 0
    });
  };

  const adjustImage = async () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('brightness', adjustments.brightness.toString());
      formData.append('contrast', adjustments.contrast.toString());
      formData.append('saturation', adjustments.saturation.toString());
      formData.append('hue', adjustments.hue.toString());

      const response = await fetch('/api/image/color-adjust', {
        method: 'POST',
        body: formData,
      });

      const result: ColorAdjustResult = await response.json();

      if (result.success && result.dataUrl) {
        setAdjustResult(result);
        toast.success("Image color adjustments applied successfully!");
      } else {
        toast.error(result.error || "Failed to adjust image colors");
      }
    } catch (error) {
      console.error('Color adjustment error:', error);
      toast.error("Failed to adjust image colors");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAdjustedImage = () => {
    if (!adjustResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = adjustResult.dataUrl;
    link.download = adjustResult.fileName || 'color-adjusted.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Color adjusted image downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasAdjustments = Object.values(adjustments).some(value => value !== 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Color Adjustments
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Fine-tune brightness, contrast, saturation, and hue of your images
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Adjustment Controls Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image & Adjust Colors
              </CardTitle>
              <CardDescription>
                Select an image file and adjust color properties
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

              {/* Color Adjustment Controls */}
              {file && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                      Color Adjustments
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAdjustments}
                      disabled={!hasAdjustments}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {/* Brightness */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Brightness
                      </Label>
                      <Badge variant="outline">
                        {adjustments.brightness > 0 ? '+' : ''}{adjustments.brightness}%
                      </Badge>
                    </div>
                    <Slider
                      value={[adjustments.brightness]}
                      onValueChange={(value) => handleAdjustmentChange('brightness', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Darker</span>
                      <span>Brighter</span>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Contrast
                      </Label>
                      <Badge variant="outline">
                        {adjustments.contrast > 0 ? '+' : ''}{adjustments.contrast}%
                      </Badge>
                    </div>
                    <Slider
                      value={[adjustments.contrast]}
                      onValueChange={(value) => handleAdjustmentChange('contrast', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Softer</span>
                      <span>Sharper</span>
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Saturation
                      </Label>
                      <Badge variant="outline">
                        {adjustments.saturation > 0 ? '+' : ''}{adjustments.saturation}%
                      </Badge>
                    </div>
                    <Slider
                      value={[adjustments.saturation]}
                      onValueChange={(value) => handleAdjustmentChange('saturation', value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>Desaturated</span>
                      <span>Vibrant</span>
                    </div>
                  </div>

                  {/* Hue */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Hue
                      </Label>
                      <Badge variant="outline">
                        {adjustments.hue > 0 ? '+' : ''}{adjustments.hue}°
                      </Badge>
                    </div>
                    <Slider
                      value={[adjustments.hue]}
                      onValueChange={(value) => handleAdjustmentChange('hue', value)}
                      min={-180}
                      max={180}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <span>-180°</span>
                      <span>+180°</span>
                    </div>
                  </div>

                  {/* Current Adjustments Summary */}
                  {hasAdjustments && (
                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                      <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                        Current Adjustments:
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {adjustments.brightness !== 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Brightness:</span>
                            <span style={{ color: 'var(--foreground)' }}>
                              {adjustments.brightness > 0 ? '+' : ''}{adjustments.brightness}%
                            </span>
                          </div>
                        )}
                        {adjustments.contrast !== 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Contrast:</span>
                            <span style={{ color: 'var(--foreground)' }}>
                              {adjustments.contrast > 0 ? '+' : ''}{adjustments.contrast}%
                            </span>
                          </div>
                        )}
                        {adjustments.saturation !== 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Saturation:</span>
                            <span style={{ color: 'var(--foreground)' }}>
                              {adjustments.saturation > 0 ? '+' : ''}{adjustments.saturation}%
                            </span>
                          </div>
                        )}
                        {adjustments.hue !== 0 && (
                          <div className="flex justify-between">
                            <span style={{ color: 'var(--muted-foreground)' }}>Hue:</span>
                            <span style={{ color: 'var(--foreground)' }}>
                              {adjustments.hue > 0 ? '+' : ''}{adjustments.hue}°
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Apply Adjustments Button */}
              <Button
                onClick={adjustImage}
                disabled={!file || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying Adjustments...
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 mr-2" />
                    Apply Color Adjustments
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Adjustment Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Adjusted Result
              </CardTitle>
              <CardDescription>
                Your color-adjusted image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adjustResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {adjustResult.fileName}
                      </span>
                    </div>
                    {adjustResult.adjustments && (
                      <div className="space-y-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          Applied Adjustments:
                        </span>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {adjustResult.adjustments.brightness !== undefined && adjustResult.adjustments.brightness !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--muted-foreground)' }}>Brightness:</span>
                              <span style={{ color: 'var(--foreground)' }}>
                                {adjustResult.adjustments.brightness > 0 ? '+' : ''}{adjustResult.adjustments.brightness}%
                              </span>
                            </div>
                          )}
                          {adjustResult.adjustments.contrast !== undefined && adjustResult.adjustments.contrast !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--muted-foreground)' }}>Contrast:</span>
                              <span style={{ color: 'var(--foreground)' }}>
                                {adjustResult.adjustments.contrast > 0 ? '+' : ''}{adjustResult.adjustments.contrast}%
                              </span>
                            </div>
                          )}
                          {adjustResult.adjustments.saturation !== undefined && adjustResult.adjustments.saturation !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--muted-foreground)' }}>Saturation:</span>
                              <span style={{ color: 'var(--foreground)' }}>
                                {adjustResult.adjustments.saturation > 0 ? '+' : ''}{adjustResult.adjustments.saturation}%
                              </span>
                            </div>
                          )}
                          {adjustResult.adjustments.hue !== undefined && adjustResult.adjustments.hue !== 0 && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--muted-foreground)' }}>Hue:</span>
                              <span style={{ color: 'var(--foreground)' }}>
                                {adjustResult.adjustments.hue > 0 ? '+' : ''}{adjustResult.adjustments.hue}°
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadAdjustedImage}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {adjustResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={adjustResult.dataUrl}
                        alt="Color adjusted image preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image file to start adjusting colors
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
              Color Adjustment Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>☀️</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Brightness</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Make images lighter or darker
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>⚡</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Contrast</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Increase or decrease image sharpness
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>🎨</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Saturation</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Control color intensity and vibrancy
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>🌈</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Hue</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Shift colors around the color wheel
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}