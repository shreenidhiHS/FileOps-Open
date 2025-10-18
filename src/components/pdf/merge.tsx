'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, FileText, AlertCircle, Loader2, X, Plus, Eye } from "lucide-react";
import { toast } from "sonner";

interface PDFFile {
  file: File;
  id: string;
}

interface MergeResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export default function MergePDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }
      
      const newFile: PDFFile = {
        file,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setFiles(prev => [...prev, newFile]);
    });
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    
    droppedFiles.forEach(file => {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }
      
      const newFile: PDFFile = {
        file,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      setFiles(prev => [...prev, newFile]);
    });
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setMergeResult(null);
    setShowPreview(false);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      toast.error("Please select at least 2 PDF files to merge");
      return;
    }

    setIsMerging(true);
    try {
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      const result: MergeResult = await response.json();

      if (result.success && result.dataUrl) {
        setMergeResult(result);
        toast.success("PDFs merged successfully!");
      } else {
        toast.error(result.error || "Failed to merge PDFs");
      }
    } catch (error) {
      console.error('Merge error:', error);
      toast.error("Failed to merge PDF files");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadMergedPDF = () => {
    if (!mergeResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = mergeResult.dataUrl;
    link.download = mergeResult.fileName || 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Merged PDF downloaded!");
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
            PDF Merger
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Combine multiple PDF files into a single document
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF Files
              </CardTitle>
              <CardDescription>
                Select or drag and drop multiple PDF files to merge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
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
                  Click to upload or drag and drop
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  PDF files up to 10MB each
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Files to merge ({files.length}):
                    </span>
                    <Button
                      onClick={clearAll}
                      variant="outline"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  </div>
                  <ScrollArea className="h-32 w-full rounded-md border" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-2 space-y-1">
                      {files.map(({ file, id }, index) => (
                        <div
                          key={id}
                          className="flex items-center justify-between p-2 rounded hover:bg-opacity-10"
                          style={{ backgroundColor: 'var(--muted)' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                              {index + 1}.
                            </span>
                            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                              {file.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(file.size)}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => removeFile(id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Merge Button */}
              <Button
                onClick={mergePDFs}
                disabled={files.length < 2 || isMerging}
                className="w-full"
                size="lg"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Merging PDFs...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Merge PDFs
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Merged Result
              </CardTitle>
              <CardDescription>
                Your merged PDF will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mergeResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {mergeResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Size:
                      </span>
                      <Badge variant="secondary">
                        {formatFileSize(mergeResult.fileSize || 0)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Pages Merged:
                      </span>
                      <Badge variant="outline">
                        {files.length} files
                      </Badge>
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
                      onClick={downloadMergedPDF}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  {/* PDF Preview */}
                  {showPreview && mergeResult.dataUrl && (
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                      <iframe
                        src={mergeResult.dataUrl}
                        className="w-full h-[400px]"
                        title="Merged PDF Preview"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload PDF files to see the merged result
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
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Upload PDFs</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select or drag and drop multiple PDF files (min 2 files)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Merge</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Click merge to combine all PDFs into a single document
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your merged PDF file
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
