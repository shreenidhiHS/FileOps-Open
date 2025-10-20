import { NextRequest, NextResponse } from 'next/server';
import { AudioServices } from '@/services/audio/audio-services';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = AudioServices.validateAudioFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Validate target format
    const supportedFormats = AudioServices.getSupportedFormats();
    if (!targetFormat || !supportedFormats.includes(targetFormat.toLowerCase())) {
      return NextResponse.json(
        { error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` },
        { status: 400 }
      );
    }

    // Convert file to AudioFile object
    const audioFile = {
      name: file.name,
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
      type: file.type
    };

    // Convert audio
    const result = await AudioServices.convertAudio(audioFile, targetFormat);

    if (result.success && result.convertedAudio) {
      const mimeType = `audio/${targetFormat}`;
      const dataUrl = `data:${mimeType};base64,${result.convertedAudio.toString('base64')}`;
      
      return NextResponse.json({
        success: true,
        dataUrl,
        fileName: result.fileName,
        originalFormat: result.originalFormat,
        newFormat: result.newFormat
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to convert audio' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Audio conversion API error:', error);
    return NextResponse.json(
      { error: 'Failed to convert audio file' },
      { status: 500 }
    );
  }
}
