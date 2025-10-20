import { Metadata } from "next";
import ConvertAudio from "@/components/audio/convert";

export const metadata: Metadata = {
  title: "Audio Converter - Convert Audio Files Online | FileOps Open",
  description: "Convert audio files between different formats including MP3, WAV, FLAC, AAC, OGG, M4A, WMA, and AIFF. Free online audio converter with high quality output.",
  keywords: "audio converter, MP3 converter, WAV converter, FLAC converter, AAC converter, OGG converter, M4A converter, WMA converter, AIFF converter, free online audio converter",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Audio Converter - Convert Audio Files Online",
    description: "Convert audio files between different formats including MP3, WAV, FLAC, AAC, OGG, M4A, WMA, and AIFF. Free online audio converter with high quality output.",
    type: "website",
    url: "https://fileops-open.vercel.app/audio/convert",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Converter - Convert Audio Files Online",
    description: "Convert audio files between different formats including MP3, WAV, FLAC, AAC, OGG, M4A, WMA, and AIFF. Free online audio converter with high quality output.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/audio/convert",
  },
};

export default function AudioConvertPage() {
  return <ConvertAudio />;
}
