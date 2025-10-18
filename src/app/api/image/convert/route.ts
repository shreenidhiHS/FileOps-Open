import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('format') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = ImageServices.validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate target format
    const supportedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    if (!targetFormat || !supportedFormats.includes(targetFormat.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Get image dimensions
    const dimensions = await ImageServices.getImageDimensions(file);

    // Convert file to ImageFile object
    const imageFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type,
      width: dimensions.width,
      height: dimensions.height
    };

    // Convert image
    const result = await ImageServices.convertImage(imageFile, targetFormat);

    if (result.success && result.convertedImage) {
      const mimeType = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
      const dataUrl = `data:${mimeType};base64,${result.convertedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        originalFormat: result.originalFormat,
        newFormat: result.newFormat
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to convert image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image conversion API error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image file' },
      { status: 500 }
    );
  }
}
