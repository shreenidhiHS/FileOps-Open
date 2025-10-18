'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Download, Copy, Check, FileText, AlertCircle, Loader2, Eye, FileDown } from "lucide-react";
import { toast } from "sonner";

interface ConversionResult {
  success: boolean;
  dataUrl?: string;
  fileSize?: number;
  mimeType?: string;
  error?: string;
}

export default function FromBase64() {
  const [base64Input, setBase64Input] = useState<string>("");
  const [pdfDataUrl, setPdfDataUrl] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleBase64Change = (value: string) => {
    setBase64Input(value);
    setPdfDataUrl("");
  };

  const convertFromBase64 = async () => {
    if (!base64Input.trim()) {
      toast.error("Please enter a Base64 string");
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch('/api/pdf/from-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64: base64Input }),
      });

      const result: ConversionResult = await response.json();

      if (result.success && result.dataUrl) {
        setPdfDataUrl(result.dataUrl);
        toast.success("Base64 converted to PDF successfully!");
      } else {
        toast.error(result.error || "Conversion failed");
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error("Failed to convert Base64 to PDF");
    } finally {
      setIsConverting(false);
    }
  };

  const copyBase64 = async () => {
    try {
      await navigator.clipboard.writeText(base64Input);
      setCopied(true);
      toast.success("Base64 copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const downloadPDF = () => {
    if (!pdfDataUrl) return;

    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = 'converted.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("PDF downloaded successfully!");
  };

  const clearAll = () => {
    setBase64Input("");
    setPdfDataUrl("");
    setShowPreview(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isValidBase64 = (str: string) => {
    try {
      // Remove data URL prefix if present
      let cleanStr = str;
      if (str.startsWith('data:')) {
        const commaIndex = str.indexOf(',');
        if (commaIndex !== -1) {
          cleanStr = str.substring(commaIndex + 1);
        }
      }
      
      // Check if it's valid base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(cleanStr);
    } catch {
      return false;
    }
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
            Base64 to PDF Converter
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Convert your Base64 encoded strings back to PDF files for easy viewing and downloading
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Base64 Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Enter Base64 String
              </CardTitle>
              <CardDescription>
                Paste your Base64 encoded string to convert it back to a PDF file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Base64 Input Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    Base64 String:
                  </label>
                  <div className="flex gap-2">
                    <Badge 
                      variant={isValidBase64(base64Input) ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isValidBase64(base64Input) ? "Valid" : "Invalid"}
                    </Badge>
                    {base64Input && (
                      <Badge variant="outline" className="text-xs">
                        {base64Input.length.toLocaleString()} chars
                      </Badge>
                    )}
                  </div>
                </div>
                <ScrollArea 
                  className="h-[200px] w-full rounded-md border" 
                  style={{ 
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--muted)'
                  }}
                >
                  <div className="p-4">
                    <Textarea
                      value={base64Input}
                      onChange={(e) => handleBase64Change(e.target.value)}
                      placeholder="Paste your Base64 string here... (with or without data:application/pdf;base64, prefix)"
                      className="min-h-[150px] font-mono text-xs resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
                      style={{ color: 'var(--muted-foreground)' }}
                    />
                  </div>
                </ScrollArea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={convertFromBase64}
                  disabled={!base64Input.trim() || !isValidBase64(base64Input) || isConverting}
                  className="flex-1"
                  size="lg"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Convert to PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={copyBase64}
                  variant="outline"
                  disabled={!base64Input.trim()}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearAll}
                  variant="outline"
                  disabled={!base64Input.trim() && !pdfDataUrl}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PDF Result Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                PDF Result
              </CardTitle>
              <CardDescription>
                Your converted PDF file will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pdfDataUrl ? (
                <>
                  {/* PDF Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Size:
                      </span>
                      <Badge variant="secondary">
                        {formatFileSize(pdfDataUrl.length * 0.75)} {/* Approximate size */}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Format:
                      </span>
                      <Badge variant="outline">
                        PDF Document
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* PDF Preview/Download */}
                  <div className="space-y-4">
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
                        onClick={downloadPDF}
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    {/* PDF Preview */}
                    {showPreview && (
                      <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                        <iframe
                          src={pdfDataUrl}
                          className="w-full h-[400px]"
                          title="PDF Preview"
                        />
                      </div>
                    )}

                    {/* Download Link */}
                    <div className="text-center">
                      <a
                        href={pdfDataUrl}
                        download="converted.pdf"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        <FileDown className="w-4 h-4" />
                        Click here to download the PDF file
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Enter a Base64 string to see the PDF conversion result
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
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Paste Base64</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Paste your Base64 string (with or without data URL prefix)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Convert</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Click convert to generate the PDF file
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Preview & Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview the PDF and download it to your device
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
