import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { base64 } = await request.json();

    if (!base64) {
      return NextResponse.json(
        { error: 'No Base64 string provided' },
        { status: 400 }
      );
    }

    // Clean the base64 string (remove data URL prefix if present)
    let cleanBase64 = base64;
    if (base64.startsWith('data:')) {
      const commaIndex = base64.indexOf(',');
      if (commaIndex !== -1) {
        cleanBase64 = base64.substring(commaIndex + 1);
      }
    }

    // Validate base64 string
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(cleanBase64)) {
      return NextResponse.json(
        { error: 'Invalid Base64 string format' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(cleanBase64, 'base64');

    // Validate that it's a PDF by checking the PDF header
    const pdfHeader = buffer.toString('ascii', 0, 4);
    if (pdfHeader !== '%PDF') {
      return NextResponse.json(
        { error: 'Base64 string does not contain valid PDF data' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: 'PDF file size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert buffer back to base64 for data URL
    const dataUrl = `data:application/pdf;base64,${cleanBase64}`;

    return NextResponse.json({
      success: true,
      dataUrl: dataUrl,
      fileSize: buffer.length,
      mimeType: 'application/pdf'
    });

  } catch (error) {
    console.error('Base64 to PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert Base64 to PDF' },
      { status: 500 }
    );
  }
}
