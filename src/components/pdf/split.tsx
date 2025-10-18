'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Download, FileText, AlertCircle, Loader2, Scissors, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SplitResult {
  success: boolean;
  splitPdfs?: Array<{
    dataUrl: string;
    fileName: string;
    pageRange: string;
  }>;
  error?: string;
}

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string[]>(['1-3']);
  const [isSplitting, setIsSplitting] = useState(false);
  const [splitResult, setSplitResult] = useState<SplitResult | null>(null);

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
      setSplitResult(null);
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
      setSplitResult(null);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const addPageRange = () => {
    setPageRanges(prev => [...prev, '']);
  };

  const removePageRange = (index: number) => {
    setPageRanges(prev => prev.filter((_, i) => i !== index));
  };

  const updatePageRange = (index: number, value: string) => {
    setPageRanges(prev => prev.map((range, i) => i === index ? value : range));
  };

  const splitPDF = async () => {
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    if (pageRanges.length === 0 || pageRanges.every(range => !range.trim())) {
      toast.error("Please enter at least one page range");
      return;
    }

    setIsSplitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pageRanges', JSON.stringify(pageRanges.filter(range => range.trim())));

      const response = await fetch('/api/pdf/split', {
        method: 'POST',
        body: formData,
      });

      const result: SplitResult = await response.json();

      if (result.success && result.splitPdfs) {
        setSplitResult(result);
        toast.success(`PDF split into ${result.splitPdfs.length} files successfully!`);
      } else {
        toast.error(result.error || "Failed to split PDF");
      }
    } catch (error) {
      console.error('Split error:', error);
      toast.error("Failed to split PDF file");
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadSplitPDF = (dataUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${fileName} downloaded!`);
  };

  const downloadAllSplitPDFs = () => {
    if (!splitResult?.splitPdfs) return;
    
    splitResult.splitPdfs.forEach((pdf, index) => {
      setTimeout(() => {
        downloadSplitPDF(pdf.dataUrl, pdf.fileName);
      }, index * 500); // Stagger downloads
    });
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
            PDF Splitter
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Split a PDF document into multiple files by page ranges
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Configuration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload PDF & Configure Split
              </CardTitle>
              <CardDescription>
                Select a PDF file and specify page ranges to split
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
                      File Size:
                    </span>
                    <Badge variant="secondary">
                      {formatFileSize(file.size)}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Page Ranges Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Page Ranges:
                  </Label>
                  <Button
                    onClick={addPageRange}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Range
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {pageRanges.map((range, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={range}
                        onChange={(e) => updatePageRange(index, e.target.value)}
                        placeholder="e.g., 1-3, 5, 7-9"
                        className="flex-1"
                      />
                      {pageRanges.length > 1 && (
                        <Button
                          onClick={() => removePageRange(index)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  Examples: 1-3 (pages 1 to 3), 5 (single page), 1-3,5,7-9 (multiple ranges)
                </p>
              </div>

              {/* Split Button */}
              <Button
                onClick={splitPDF}
                disabled={!file || pageRanges.length === 0 || isSplitting}
                className="w-full"
                size="lg"
              >
                {isSplitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Splitting PDF...
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 mr-2" />
                    Split PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Split Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Split Results
              </CardTitle>
              <CardDescription>
                Your split PDF files will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {splitResult?.splitPdfs ? (
                <>
                  {/* Results Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Files Created:
                      </span>
                      <Badge variant="secondary">
                        {splitResult.splitPdfs.length} files
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Split Files List */}
                  <ScrollArea className="h-64 w-full rounded-md border" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-2 space-y-2">
                      {splitResult.splitPdfs.map((pdf, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded border"
                          style={{ 
                            borderColor: 'var(--border)',
                            backgroundColor: 'var(--muted)'
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
                              {pdf.fileName}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Pages: {pdf.pageRange}
                            </div>
                          </div>
                          <Button
                            onClick={() => downloadSplitPDF(pdf.dataUrl, pdf.fileName)}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Download All Button */}
                  <Button
                    onClick={downloadAllSplitPDFs}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Files
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload a PDF file and configure page ranges to see split results
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
                  Select the PDF file you want to split
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Set Ranges</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Specify page ranges for each split (e.g., 1-3, 5, 7-9)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Download individual files or all at once
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
