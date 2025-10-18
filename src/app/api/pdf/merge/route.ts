import { NextRequest, NextResponse } from 'next/server';
import { PDFServices } from '@/services/pdf/pdf-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 PDF files are required for merging' },
        { status: 400 }
      );
    }

    // Validate all files
    for (const file of files) {
      const validation = PDFServices.validatePDF(file);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }
    }

    // Convert files to PDFFile objects
    const pdfFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        size: file.size,
        data: Buffer.from(await file.arrayBuffer()),
        type: file.type
      }))
    );

    // Merge PDFs
    const result = await PDFServices.mergePDFs(pdfFiles);

    if (result.success && result.mergedPdf) {
      const dataUrl = `data:application/pdf;base64,${result.mergedPdf.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        fileSize: result.fileSize
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to merge PDFs' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF merge API error:', error);
    return NextResponse.json(
      { error: 'Failed to merge PDF files' },
      { status: 500 }
    );
  }
}
