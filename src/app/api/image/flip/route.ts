import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const direction = formData.get('direction') as 'horizontal' | 'vertical';

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

    // Validate direction
    if (!['horizontal', 'vertical'].includes(direction)) {
      return NextResponse.json(
        { error: 'Direction must be horizontal or vertical' },
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

    // Flip image
    const result = await ImageServices.flipImage(imageFile, direction);

    if (result.success && result.flippedImage) {
      const dataUrl = `data:${file.type};base64,${result.flippedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        direction
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to flip image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image flip API error:', error);
    return NextResponse.json(
      { error: 'Failed to flip image file' },
      { status: 500 }
    );
  }
}
