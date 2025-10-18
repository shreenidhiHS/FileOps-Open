import { NextRequest, NextResponse } from 'next/server';
import { ImageServices } from '@/services/image/image-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brightness = parseFloat(formData.get('brightness') as string) || 0;
    const contrast = parseFloat(formData.get('contrast') as string) || 0;
    const saturation = parseFloat(formData.get('saturation') as string) || 0;
    const hue = parseFloat(formData.get('hue') as string) || 0;

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

    // Validate adjustment values
    if (brightness < -100 || brightness > 100) {
      return NextResponse.json(
        { error: 'Brightness must be between -100 and 100' },
        { status: 400 }
      );
    }

    if (contrast < -100 || contrast > 100) {
      return NextResponse.json(
        { error: 'Contrast must be between -100 and 100' },
        { status: 400 }
      );
    }

    if (saturation < -100 || saturation > 100) {
      return NextResponse.json(
        { error: 'Saturation must be between -100 and 100' },
        { status: 400 }
      );
    }

    if (hue < -180 || hue > 180) {
      return NextResponse.json(
        { error: 'Hue must be between -180 and 180' },
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

    // Adjust image colors
    const result = await ImageServices.adjustImageColors(imageFile, {
      brightness,
      contrast,
      saturation,
      hue
    });

    if (result.success && result.adjustedImage) {
      const dataUrl = `data:${file.type};base64,${result.adjustedImage.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        adjustments: result.adjustments
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to adjust image colors' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image color adjustment API error:', error);
    return NextResponse.json(
      { error: 'Failed to adjust image colors' },
      { status: 500 }
    );
  }
}
