import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const x = parseInt(formData.get('x') as string);
    const y = parseInt(formData.get('y') as string);
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);

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

    // Validate crop parameters
    if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
      return NextResponse.json(
        { error: 'Invalid crop parameters' },
        { status: 400 }
      );
    }

    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: 'Crop parameters must be positive' },
        { status: 400 }
      );
    }

    // Get image dimensions
    const dimensions = await ImageServices.getImageDimensions(file);

    // Validate crop area is within image bounds
    if (x + width > dimensions.width || y + height > dimensions.height) {
      return NextResponse.json(
        { error: 'Crop area exceeds image boundaries' },
        { status: 400 }
      );
    }

    // Convert file to ImageFile object
    const imageFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type,
      width: dimensions.width,
      height: dimensions.height
    };

    // Crop image
    const result = await ImageServices.cropImage(imageFile, x, y, width, height);

    if (result.success && result.croppedImage) {
      const dataUrl = `data:${file.type};base64,${result.croppedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        cropArea: { x, y, width, height }
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to crop image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image crop API error:', error);
    return NextResponse.json(
      { error: 'Failed to crop image file' },
      { status: 500 }
    );
  }
}
