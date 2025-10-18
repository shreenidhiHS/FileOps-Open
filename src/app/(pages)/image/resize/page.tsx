import { Metadata } from "next";
import ResizeImage from "@/components/image/resize";

export const metadata: Metadata = {
  title: "Image Resizer - Free Online Image Resize Tool | FileOps Open",
  description: "Resize images to specific dimensions while maintaining aspect ratio online for free. Easy-to-use image resizing tool.",
  keywords: "image resizer, resize image, image resize, aspect ratio, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Resizer - Free Online Tool",
    description: "Resize images to specific dimensions while maintaining aspect ratio online for free. Easy-to-use image resizing tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/resize",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Resizer - Free Online Tool",
    description: "Resize images to specific dimensions while maintaining aspect ratio online for free. Easy-to-use image resizing tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/resize",
  },
};

export default function ResizeImagePage() {
  return <ResizeImage />;
}
