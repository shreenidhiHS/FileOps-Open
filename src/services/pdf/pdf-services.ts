// PDF Services - Business logic for PDF operations
// This file contains all the core PDF processing logic

import { PDFDocument } from 'pdf-lib';

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

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const file of files) {
        try {
          // First validate the PDF buffer
          const validation = await this.validatePDFBuffer(file.data);
          if (!validation.valid) {
            return {
              success: false,
              error: `File ${file.name} is corrupted or invalid: ${validation.error}`
            };
          }

          // Load the PDF document from buffer
          const pdfDoc = await PDFDocument.load(file.data);
          
          // Copy all pages from the current PDF to the merged PDF
          const pageIndices = pdfDoc.getPageIndices();
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);
          
          // Add each copied page to the merged PDF
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          return {
            success: false,
            error: `Failed to process file ${file.name}. Please ensure it's a valid PDF.`
          };
        }
      }

      // Generate the merged PDF as bytes
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBuffer = Buffer.from(mergedPdfBytes);
      
      return {
        success: true,
        mergedPdf: mergedBuffer,
        fileName: `merged-${Date.now()}.pdf`,
        fileSize: mergedBuffer.length
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

      // First validate the PDF buffer
      const validation = await this.validatePDFBuffer(file.data);
      if (!validation.valid) {
        return {
          success: false,
          error: `File is corrupted or invalid: ${validation.error}`
        };
      }

      // Load the source PDF
      const sourcePdf = await PDFDocument.load(file.data);
      const totalPages = sourcePdf.getPageCount();

      const splitPdfs = [];

      for (let i = 0; i < pageRanges.length; i++) {
        const range = pageRanges[i];
        const pages = this.parsePageRanges(range, totalPages);

        if (pages.length === 0) {
          continue; // Skip invalid ranges
        }

        // Create a new PDF for this range
        const newPdf = await PDFDocument.create();
        
        // Copy the specified pages
        const copiedPages = await newPdf.copyPages(sourcePdf, pages.map(p => p - 1)); // Convert to 0-based index
        
        // Add each copied page to the new PDF
        copiedPages.forEach((page) => newPdf.addPage(page));

        // Generate the PDF bytes
        const pdfBytes = await newPdf.save();
        const pdfBuffer = Buffer.from(pdfBytes);

        splitPdfs.push({
          data: pdfBuffer,
          fileName: `${file.name.replace('.pdf', '')}-part-${i + 1}.pdf`,
          pageRange: range
        });
      }

      if (splitPdfs.length === 0) {
        return {
          success: false,
          error: 'No valid page ranges provided'
        };
      }

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

      const originalSize = file.data.length;

      // First validate the PDF buffer
      const validation = await this.validatePDFBuffer(file.data);
      if (!validation.valid) {
        return {
          success: false,
          error: `File is corrupted or invalid: ${validation.error}`
        };
      }

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(file.data);

      // Save with compression options
      // pdf-lib automatically applies compression when saving
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true, // Enable object streams for better compression
        addDefaultPage: false,  // Don't add default page
        objectsPerTick: 50,     // Process objects in batches for memory efficiency
      });

      const compressedBuffer = Buffer.from(compressedBytes);
      const compressedSize = compressedBuffer.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100;

      return {
        success: true,
        compressedPdf: compressedBuffer,
        fileName: file.name.replace('.pdf', '-compressed.pdf'),
        originalSize,
        compressedSize,
        compressionRatio: Math.max(0, compressionRatio) // Ensure non-negative ratio
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
   * Validate PDF buffer and check if it's a valid PDF
   */
  static async validatePDFBuffer(buffer: Buffer): Promise<{ valid: boolean; error?: string }> {
    try {
      // Check if buffer is empty
      if (buffer.length === 0) {
        return {
          valid: false,
          error: 'Empty PDF file'
        };
      }

      // Check if it starts with PDF header
      const header = buffer.toString('ascii', 0, 4);
      if (header !== '%PDF') {
        return {
          valid: false,
          error: 'Not a valid PDF file (missing PDF header)'
        };
      }

      // Try to load the PDF to check if it's valid
      await PDFDocument.load(buffer);
      return { valid: true };
    } catch (error: any) {
      console.error('PDF validation error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid object ref')) {
        return {
          valid: false,
          error: 'PDF file is corrupted (invalid object references)'
        };
      } else if (error.message?.includes('Failed to parse PDF document')) {
        return {
          valid: false,
          error: 'PDF file is corrupted (parsing failed)'
        };
      } else if (error.message?.includes('Invalid PDF')) {
        return {
          valid: false,
          error: 'Invalid PDF file format'
        };
      }
      
      return {
        valid: false,
        error: 'Invalid or corrupted PDF file'
      };
    }
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
