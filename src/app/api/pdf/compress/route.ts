import { NextRequest, NextResponse } from 'next/server';
import { PDFServices } from '@/services/pdf/pdf-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = parseFloat(formData.get('quality') as string) || 0.8;

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = PDFServices.validatePDF(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate quality
    if (quality < 0.1 || quality > 1.0) {
      return NextResponse.json(
        { error: 'Quality must be between 0.1 and 1.0' },
        { status: 400 }
      );
    }

    // Convert file to PDFFile object
    const pdfFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type
    };

    // Compress PDF
    const result = await PDFServices.compressPDF(pdfFile, quality);

    if (result.success && result.compressedPdf) {
      const dataUrl = `data:application/pdf;base64,${result.compressedPdf.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to compress PDF' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF compression API error:', error);
    return NextResponse.json(
      { error: 'Failed to compress PDF file' },
      { status: 500 }
    );
  }
}
