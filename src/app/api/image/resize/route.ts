import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);
    const maintainAspectRatio = formData.get('maintainAspectRatio') === 'true';

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

    // Validate dimensions
    if (isNaN(width) || isNaN(height)) {
      return NextResponse.json(
        { error: 'Invalid dimensions' },
        { status: 400 }
      );
    }

    if (width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: 'Dimensions must be positive' },
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

    // Resize image
    const result = await ImageServices.resizeImage(imageFile, width, height, maintainAspectRatio);

    if (result.success && result.resizedImage) {
      const dataUrl = `data:${file.type};base64,${result.resizedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        originalDimensions: {
          width: result.originalWidth,
          height: result.originalHeight
        },
        newDimensions: {
          width: result.newWidth,
          height: result.newHeight
        }
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to resize image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image resize API error:', error);
    return NextResponse.json(
      { error: 'Failed to resize image file' },
      { status: 500 }
    );
  }
}
