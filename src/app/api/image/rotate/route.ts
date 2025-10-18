import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const degrees = parseInt(formData.get('degrees') as string) || 90;

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

    // Validate degrees
    if (![90, 180, 270].includes(degrees)) {
      return NextResponse.json(
        { error: 'Degrees must be 90, 180, or 270' },
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

    // Rotate image
    const result = await ImageServices.rotateImage(imageFile, degrees);

    if (result.success && result.rotatedImage) {
      const dataUrl = `data:${file.type};base64,${result.rotatedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        degrees
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to rotate image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image rotation API error:', error);
    return NextResponse.json(
      { error: 'Failed to rotate image file' },
      { status: 500 }
    );
  }
}
