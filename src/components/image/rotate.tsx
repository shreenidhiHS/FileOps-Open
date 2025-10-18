'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, Image as ImageIcon, AlertCircle, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface RotateResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  degrees?: number;
  error?: string;
}

export default function RotateImage() {
  const [file, setFile] = useState<File | null>(null);
  const [degrees, setDegrees] = useState(90);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateResult, setRotateResult] = useState<RotateResult | null>(null);

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
      setRotateResult(null);
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
      setRotateResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const rotateImage = async () => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    setIsRotating(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('degrees', degrees.toString());

      const response = await fetch('/api/image/rotate', {
        method: 'POST',
        body: formData,
      });

      const result: RotateResult = await response.json();

      if (result.success && result.dataUrl) {
        setRotateResult(result);
        toast.success(`Image rotated ${degrees}° successfully!`);
      } else {
        toast.error(result.error || "Failed to rotate image");
      }
    } catch (error) {
      console.error('Rotation error:', error);
      toast.error("Failed to rotate image file");
    } finally {
      setIsRotating(false);
    }
  };

  const downloadRotatedImage = () => {
    if (!rotateResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = rotateResult.dataUrl;
    link.download = rotateResult.fileName || 'rotated.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Rotated image downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const rotationOptions = [
    { value: 90, label: '90° Clockwise' },
    { value: 180, label: '180° (Upside Down)' },
    { value: 270, label: '270° Clockwise (90° Counter-clockwise)' }
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
            Image Rotator
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Rotate images by 90, 180, or 270 degrees clockwise or counterclockwise
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Image & Settings
              </CardTitle>
              <CardDescription>
                Select an image file and choose rotation angle
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

              {/* Rotation Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Rotation Angle:
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {rotationOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={degrees === option.value ? "default" : "outline"}
                        onClick={() => setDegrees(option.value)}
                        className="justify-start"
                      >
                        <RotateCw className="w-4 h-4 mr-2" />
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Selection */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <strong>Selected:</strong> {rotationOptions.find(opt => opt.value === degrees)?.label}
                  </div>
                </div>
              </div>

              {/* Rotate Button */}
              <Button
                onClick={rotateImage}
                disabled={!file || isRotating}
                className="w-full"
                size="lg"
              >
                {isRotating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rotating Image...
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Rotate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Rotation Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Rotation Results
              </CardTitle>
              <CardDescription>
                Your rotated image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rotateResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {rotateResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Rotation:
                      </span>
                      <Badge variant="outline">
                        {rotateResult.degrees}°
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadRotatedImage}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Image
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {rotateResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={rotateResult.dataUrl}
                        alt="Rotated image preview"
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an image file to see rotation results
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
                  Select the image file you want to rotate
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Choose Angle</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select 90°, 180°, or 270° rotation
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your rotated image
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
