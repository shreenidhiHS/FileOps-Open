import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

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

    // Remove background
    const result = await ImageServices.removeBackground(imageFile);

    if (result.success && result.processedImage) {
      const dataUrl = `data:image/png;base64,${result.processedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to remove background' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Background removal API error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
}
