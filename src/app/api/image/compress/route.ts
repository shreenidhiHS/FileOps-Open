import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const quality = parseFloat(formData.get('quality') as string) || 0.8;

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

    // Validate quality
    if (quality < 0.1 || quality > 1.0) {
      return NextResponse.json(
        { error: 'Quality must be between 0.1 and 1.0' },
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

    // Compress image
    const result = await ImageServices.compressImage(imageFile, quality);

    if (result.success && result.compressedImage) {
      const dataUrl = `data:${file.type};base64,${result.compressedImage.toString('base64')}`;
      
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
        { error: result.error || 'Failed to compress image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image compression API error:', error);
    return NextResponse.json(
      { error: 'Failed to compress image file' },
      { status: 500 }
    );
  }
}
