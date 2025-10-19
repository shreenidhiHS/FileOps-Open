'use client'

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Music, AlertCircle, Loader2, FileAudio } from "lucide-react";
import { toast } from "sonner";

interface ConvertResult {
  success: boolean;
  dataUrl?: string;
  fileName?: string;
  originalFormat?: string;
  newFormat?: string;
  error?: string;
}

interface FormatInfo {
  name: string;
  extension: string;
  description: string;
  features: string[];
  quality: 'high' | 'medium' | 'low';
  compression: boolean;
}

export default function ConvertAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [originalFormat, setOriginalFormat] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertResult, setConvertResult] = useState<ConvertResult | null>(null);

  const supportedFormats: FormatInfo[] = [
    {
      name: 'MP3',
      extension: 'mp3',
      description: 'Most compatible audio format',
      features: ['Lossy compression', 'Small file size', 'Universal support'],
      quality: 'medium',
      compression: true
    },
    {
      name: 'WAV',
      extension: 'wav',
      description: 'Uncompressed audio format',
      features: ['Lossless quality', 'Large file size', 'Professional use'],
      quality: 'high',
      compression: false
    },
    {
      name: 'FLAC',
      extension: 'flac',
      description: 'Lossless compressed audio',
      features: ['Lossless compression', 'Smaller than WAV', 'High quality'],
      quality: 'high',
      compression: true
    },
    {
      name: 'AAC',
      extension: 'aac',
      description: 'Advanced audio coding',
      features: ['Better than MP3', 'Small file size', 'Apple devices'],
      quality: 'high',
      compression: true
    },
    {
      name: 'OGG',
      extension: 'ogg',
      description: 'Open source audio format',
      features: ['Open source', 'Good compression', 'Web friendly'],
      quality: 'high',
      compression: true
    },
    {
      name: 'M4A',
      extension: 'm4a',
      description: 'MPEG-4 audio format',
      features: ['High quality', 'Small file size', 'iTunes compatible'],
      quality: 'high',
      compression: true
    },
    {
      name: 'WMA',
      extension: 'wma',
      description: 'Windows Media Audio',
      features: ['Microsoft format', 'Good compression', 'Windows devices'],
      quality: 'medium',
      compression: true
    },
    {
      name: 'AIFF',
      extension: 'aiff',
      description: 'Audio Interchange File Format',
      features: ['Lossless quality', 'Large file size', 'Mac compatible'],
      quality: 'high',
      compression: false
    }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('audio/')) {
        toast.error("Please select an audio file");
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setFile(selectedFile);
      setConvertResult(null);
      
      // Create audio URL and get format
      const url = URL.createObjectURL(selectedFile);
      
      // Extract format from file type or extension
      const format = selectedFile.type.split('/')[1]?.toLowerCase() || 
                   selectedFile.name.split('.').pop()?.toLowerCase() || '';
      setOriginalFormat(format);
      
      // Set default target format (different from original)
      const availableFormats = supportedFormats.filter(f => f.extension !== format);
      if (availableFormats.length > 0) {
        setSelectedFormat(availableFormats[0].extension);
      }
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith('audio/')) {
        toast.error("Please drop an audio file");
        return;
      }
      if (droppedFile.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setFile(droppedFile);
      setConvertResult(null);
      
      const url = URL.createObjectURL(droppedFile);
      
      const format = droppedFile.type.split('/')[1]?.toLowerCase() || 
                   droppedFile.name.split('.').pop()?.toLowerCase() || '';
      setOriginalFormat(format);
      
      const availableFormats = supportedFormats.filter(f => f.extension !== format);
      if (availableFormats.length > 0) {
        setSelectedFormat(availableFormats[0].extension);
      }
    }
  }, [supportedFormats]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const convertAudio = async () => {
    if (!file) {
      toast.error("Please select an audio file");
      return;
    }

    if (!selectedFormat) {
      toast.error("Please select a target format");
      return;
    }

    if (selectedFormat === originalFormat) {
      toast.error("Please select a different format from the original");
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', selectedFormat);

      const response = await fetch('/api/audio/convert', {
        method: 'POST',
        body: formData,
      });

      const result: ConvertResult = await response.json();

      if (result.success && result.dataUrl) {
        setConvertResult(result);
        toast.success(`Audio converted to ${selectedFormat.toUpperCase()} successfully!`);
      } else {
        toast.error(result.error || "Failed to convert audio");
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error("Failed to convert audio file");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadConvertedAudio = () => {
    if (!convertResult?.dataUrl) return;

    const link = document.createElement('a');
    link.href = convertResult.dataUrl;
    link.download = convertResult.fileName || 'converted.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Converted audio downloaded!");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatInfo = (extension: string) => {
    return supportedFormats.find(f => f.extension === extension);
  };

  const availableFormats = supportedFormats.filter(f => f.extension !== originalFormat);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Audio Format Converter
          </h1>
          <p 
            className="text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Convert audio files between different formats with quality control
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* File Upload & Conversion Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Audio & Conversion Settings
              </CardTitle>
              <CardDescription>
                Select an audio file and choose target format
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
                <Music className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Audio files up to 100MB
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Current Format:
                    </span>
                    <Badge variant="outline">
                      {originalFormat.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Format Selection */}
              {file && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      Convert to:
                    </label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target format" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFormats.map((format) => (
                          <SelectItem key={format.extension} value={format.extension}>
                            <div className="flex flex-col">
                              <span className="font-medium">{format.name}</span>
                              <span className="text-xs text-muted-foreground">{format.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Format Info */}
                  {selectedFormat && (
                    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                      {(() => {
                        const formatInfo = getFormatInfo(selectedFormat);
                        return formatInfo ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                {formatInfo.name} Format
                              </h4>
                              <Badge variant={formatInfo.quality === 'high' ? 'default' : formatInfo.quality === 'medium' ? 'secondary' : 'outline'}>
                                {formatInfo.quality} quality
                              </Badge>
                            </div>
                            <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                              {formatInfo.description}
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                                Features:
                              </p>
                              <ul className="text-xs space-y-1" style={{ color: 'var(--muted-foreground)' }}>
                                {formatInfo.features.map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: 'var(--primary)' }} />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Convert Button */}
              <Button
                onClick={convertAudio}
                disabled={!file || !selectedFormat || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Converting Audio...
                  </>
                ) : (
                  <>
                    <FileAudio className="w-4 h-4 mr-2" />
                    Convert Audio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Conversion Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Converted Result
              </CardTitle>
              <CardDescription>
                Your converted audio will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {convertResult ? (
                <>
                  {/* Result Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        File Name:
                      </span>
                      <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {convertResult.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        Original Format:
                      </span>
                      <Badge variant="outline">
                        {convertResult.originalFormat?.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                        New Format:
                      </span>
                      <Badge variant="default">
                        {convertResult.newFormat?.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadConvertedAudio}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Audio
                    </Button>
                  </div>

                  {/* Audio Preview */}
                  {convertResult.dataUrl && (
                    <div className="border rounded-lg p-4" style={{ borderColor: 'var(--border)' }}>
                      <audio
                        controls
                        className="w-full"
                        style={{ backgroundColor: 'var(--muted)' }}
                      >
                        <source src={convertResult.dataUrl} type={`audio/${convertResult.newFormat}`} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload an audio file to start converting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supported Formats Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Supported Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportedFormats.map((format) => (
                <div key={format.extension} className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <FileAudio className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                    <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      {format.name}
                    </h3>
                  </div>
                  <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    {format.description}
                  </p>
                  <div className="space-y-1">
                    {format.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: 'var(--primary)' }} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Upload Audio</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select the audio file you want to convert
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>2</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Choose Format</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Select your desired output format
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-lg font-bold" style={{ color: 'var(--primary-foreground)' }}>3</span>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Download</h3>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Preview and download your converted audio
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
