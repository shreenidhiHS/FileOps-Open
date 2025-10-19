import { NextRequest, NextResponse } from 'next/server';
import { VideoServices } from '@/services/video/video-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = VideoServices.validateVideoFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate target format
    const supportedFormats = VideoServices.getSupportedFormats();
    if (!targetFormat || !supportedFormats.includes(targetFormat.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert file to VideoFile object
    const videoFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type
    };

    // Convert video
    const result = await VideoServices.convertVideo(videoFile, targetFormat);

    if (result.success && result.convertedVideo) {
      const mimeType = `video/${targetFormat}`;
      const dataUrl = `data:${mimeType};base64,${result.convertedVideo.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        originalFormat: result.originalFormat,
        newFormat: result.newFormat
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to convert video' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Video conversion API error:', error);
    return NextResponse.json(
      { error: 'Failed to convert video file' },
      { status: 500 }
    );
  }
}
