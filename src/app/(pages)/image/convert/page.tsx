import { Metadata } from "next";
import ConvertImage from "@/components/image/convert";

export const metadata: Metadata = {
  title: "Image Converter - Free Online Image Format Converter | FileOps Open",
  description: "Convert images between different formats (JPG, PNG, WebP, GIF, BMP) online for free. Easy-to-use image format converter.",
  keywords: "image converter, convert image, JPG to PNG, PNG to JPG, WebP converter, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Converter - Free Online Tool",
    description: "Convert images between different formats (JPG, PNG, WebP, GIF, BMP) online for free. Easy-to-use image format converter.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/convert",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Converter - Free Online Tool",
    description: "Convert images between different formats (JPG, PNG, WebP, GIF, BMP) online for free. Easy-to-use image format converter.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/convert",
  },
};

export default function ConvertImagePage() {
  return <ConvertImage />;
}
