import { Metadata } from "next";
import ConvertVideo from "@/components/video/convert";

export const metadata: Metadata = {
  title: "Video Converter - Convert Video Files Online | FileOps Open",
  description: "Convert video files between different formats including MP4, AVI, MOV, WebM, MKV, FLV, WMV, and M4V. Free online video converter with high quality output.",
  keywords: "video converter, MP4 converter, AVI converter, MOV converter, WebM converter, MKV converter, FLV converter, WMV converter, M4V converter, free online video converter",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Video Converter - Convert Video Files Online",
    description: "Convert video files between different formats including MP4, AVI, MOV, WebM, MKV, FLV, WMV, and M4V. Free online video converter with high quality output.",
    type: "website",
    url: "https://fileops-open.vercel.app/video/convert",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Converter - Convert Video Files Online",
    description: "Convert video files between different formats including MP4, AVI, MOV, WebM, MKV, FLV, WMV, and M4V. Free online video converter with high quality output.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/video/convert",
  },
};

export default function VideoConvertPage() {
  return <ConvertVideo />;
}
