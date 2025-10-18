// PDF Services - Business logic for PDF operations
// This file contains all the core PDF processing logic

export interface PDFFile {
  name: string;
  size: number;
  data: Buffer;
  type: string;
}

export interface PDFMergeResult {
  success: boolean;
  mergedPdf?: Buffer;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface PDFSplitResult {
  success: boolean;
  splitPdfs?: Array<{
    data: Buffer;
    fileName: string;
    pageRange: string;
  }>;
  error?: string;
}

export interface PDFCompressResult {
  success: boolean;
  compressedPdf?: Buffer;
  fileName?: string;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
  error?: string;
}

export class PDFServices {
  /**
   * Merge multiple PDF files into a single PDF
   */
  static async mergePDFs(files: PDFFile[]): Promise<PDFMergeResult> {
    try {
      if (files.length < 2) {
        return {
          success: false,
          error: 'At least 2 PDF files are required for merging'
        };
      }

      // Validate all files are PDFs
      for (const file of files) {
        if (file.type !== 'application/pdf') {
          return {
            success: false,
            error: `File ${file.name} is not a valid PDF`
          };
        }
      }

      // For now, we'll use a simple approach
      // In production, you'd use a library like PDF-lib or similar
      const mergedData = Buffer.concat(files.map(file => file.data));
      
      return {
        success: true,
        mergedPdf: mergedData,
        fileName: `merged-${Date.now()}.pdf`,
        fileSize: mergedData.length
      };
    } catch (error) {
      console.error('PDF merge error:', error);
      return {
        success: false,
        error: 'Failed to merge PDF files'
      };
    }
  }

  /**
   * Split a PDF into multiple files based on page ranges
   */
  static async splitPDF(file: PDFFile, pageRanges: string[]): Promise<PDFSplitResult> {
    try {
      if (file.type !== 'application/pdf') {
        return {
          success: false,
          error: 'File is not a valid PDF'
        };
      }

      if (pageRanges.length === 0) {
        return {
          success: false,
          error: 'At least one page range is required'
        };
      }

      // For now, we'll create placeholder split files
      // In production, you'd use a library like PDF-lib
      const splitPdfs = pageRanges.map((range, index) => ({
        data: file.data, // This would be the actual split data
        fileName: `${file.name.replace('.pdf', '')}-part-${index + 1}.pdf`,
        pageRange: range
      }));

      return {
        success: true,
        splitPdfs
      };
    } catch (error) {
      console.error('PDF split error:', error);
      return {
        success: false,
        error: 'Failed to split PDF file'
      };
    }
  }

  /**
   * Compress a PDF file to reduce its size
   */
  static async compressPDF(file: PDFFile, quality: number = 0.8): Promise<PDFCompressResult> {
    try {
      if (file.type !== 'application/pdf') {
        return {
          success: false,
          error: 'File is not a valid PDF'
        };
      }

      // For now, we'll simulate compression
      // In production, you'd use a library like PDF-lib with compression
      const originalSize = file.data.length;
      const compressedSize = Math.floor(originalSize * quality);
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      // Simulate compressed data (in reality, this would be actual compression)
      const compressedData = file.data.slice(0, compressedSize);

      return {
        success: true,
        compressedPdf: compressedData,
        fileName: file.name.replace('.pdf', '-compressed.pdf'),
        originalSize,
        compressedSize,
        compressionRatio
      };
    } catch (error) {
      console.error('PDF compression error:', error);
      return {
        success: false,
        error: 'Failed to compress PDF file'
      };
    }
  }

  /**
   * Validate PDF file
   */
  static validatePDF(file: File): { valid: boolean; error?: string } {
    if (file.type !== 'application/pdf') {
      return {
        valid: false,
        error: 'File must be a PDF'
      };
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return {
        valid: false,
        error: 'File size must be less than 10MB'
      };
    }

    return { valid: true };
  }

  /**
   * Parse page range string (e.g., "1-3,5,7-9")
   */
  static parsePageRanges(pageRangeStr: string, totalPages: number): number[] {
    const pages: number[] = [];
    const ranges = pageRangeStr.split(',');

    for (const range of ranges) {
      const trimmed = range.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start >= 1 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        }
      } else {
        const page = parseInt(trimmed);
        if (page && page >= 1 && page <= totalPages) {
          pages.push(page);
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
