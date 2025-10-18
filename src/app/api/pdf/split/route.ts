import { NextRequest, NextResponse } from 'next/server';
import { PDFServices } from '@/services/pdf/pdf-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pageRanges = JSON.parse(formData.get('pageRanges') as string);

    if (!file) {
      return NextResponse.json(
        { error: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (!pageRanges || !Array.isArray(pageRanges) || pageRanges.length === 0) {
      return NextResponse.json(
        { error: 'Page ranges are required' },
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

    // Convert file to PDFFile object
    const pdfFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type
    };

    // Split PDF
    const result = await PDFServices.splitPDF(pdfFile, pageRanges);

    if (result.success && result.splitPdfs) {
      const splitPdfs = result.splitPdfs.map(pdf => ({
        dataUrl: `data:application/pdf;base64,${pdf.data.toString('base64')}`,
        fileName: pdf.fileName,
        pageRange: pdf.pageRange
      }));
      
      return NextResponse.json({
        success: true,
        splitPdfs
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to split PDF' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('PDF split API error:', error);
    return NextResponse.json(
      { error: 'Failed to split PDF file' },
      { status: 500 }
    );
  }
}
