'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Upload, Download, FileText, AlertCircle, Loader2, Minus, Eye } from "lucide-react";
import { toast } from "sonner";

interface CompressResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState([80]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressResult, setCompressResult] = useState<CompressResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Please select a PDF file");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setCompressResult(null);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        toast.error("Please drop a PDF file");
        return;
      }
      if (droppedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(droppedFile);
      setCompressResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const compressPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsCompressing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', (quality[0] / 100).toString());

      const response = await fetch('/api/pdf/compress', {
        method: 'POST',
        body: formData,
      });

      const result: CompressResult = await response.json();

      if (result.success && result.dataUrl) {
        setCompressResult(result);
        toast.success(`PDF compressed successfully! ${result.compressionRatio?.toFixed(1)}% size reduction`);
      } else {
        toast.error(result.error || "Failed to compress PDF");
      }
    } catch (error) {
      console.error('Compression error:', error);
      toast.error("Failed to compress PDF file");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressedPDF = () => {
    if (!compressResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = compressResult.dataUrl;
    link.download = compressResult.fileName || 'compressed.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Compressed PDF downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getQualityLabel = (value: number) => {
    if (value >= 90) return 'High Quality';
    if (value >= 70) return 'Good Quality';
    if (value >= 50) return 'Medium Quality';
    return 'Low Quality';
  };

  const getQualityColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-blue-600';
    if (value >= 50) return 'text-yellow-600';
    return 'text-red-600';
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
            PDF Compressor
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Reduce PDF file size while maintaining quality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF & Settings
              </CardTitle>
              <CardDescription>
                Select a PDF file and adjust compression quality
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
                <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  PDF files up to 10MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,application/pdf"
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
                      Original Size:
                    </span>
                    <Badge variant="secondary">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Quality Settings */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Compression Quality:
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                        {quality[0]}%
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getQualityColor(quality[0])}`}
                      >
                        {getQualityLabel(quality[0])}
                      </Badge>
                    </div>
                  </div>
                  
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    max={100}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>High Compression</span>
                    <span>High Quality</span>
                  </div>
                </div>

                {/* Quality Info */}
                <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                  <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <strong>Quality Guide:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• 90-100%: Minimal compression, best quality</li>
                      <li>• 70-89%: Good balance of size and quality</li>
                      <li>• 50-69%: Moderate compression, acceptable quality</li>
                      <li>• 10-49%: High compression, lower quality</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Compress Button */}
              <Button
                onClick={compressPDF}
                disabled={!file || isCompressing}
                className="w-full"
                size="lg"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Compressing PDF...
                  </>
                ) : (
                  <>
                    <Minus className="w-4 h-4 mr-2" />
                    Compress PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Compression Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compression Results
              </CardTitle>
              <CardDescription>
                Your compressed PDF will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {compressResult ? (
                <>
                  {/* Compression Stats */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="text-2xl font-bold text-red-600">
                          {formatFileSize(compressResult.originalSize || 0)}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Original Size
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                        <div className="text-2xl font-bold text-green-600">
                          {formatFileSize(compressResult.compressedSize || 0)}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Compressed Size
                        </div>
                      </div>
                    </div>

                    {/* Compression Ratio */}
                    <div className="text-center p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {compressResult.compressionRatio?.toFixed(1)}%
                      </div>
                      <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Size Reduction
                      </div>
                      <Progress 
                        value={compressResult.compressionRatio || 0} 
                        className="mt-2"
                      />
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          File Name:
                        </span>
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {compressResult.fileName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPreview(!showPreview)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button
                      onClick={downloadCompressedPDF}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  {/* PDF Preview */}
                  {showPreview && compressResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <iframe
                        src={compressResult.dataUrl}
                        className="w-full h-[400px]"
                        title="Compressed PDF Preview"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload a PDF file to see compression results
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
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Upload PDF</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select the PDF file you want to compress
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Adjust Quality</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Choose compression quality (10-100%)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your compressed PDF
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
