import { Metadata } from "next";
import RotateImage from "@/components/image/rotate";

export const metadata: Metadata = {
  title: "Image Rotator - Free Online Image Rotation Tool | FileOps Open",
  description: "Rotate images by 90, 180, or 270 degrees online for free. Easy-to-use image rotation tool supporting all major image formats.",
  keywords: "image rotator, rotate image, image rotation, 90 degrees, 180 degrees, 270 degrees, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Rotator - Free Online Tool",
    description: "Rotate images by 90, 180, or 270 degrees online for free. Easy-to-use image rotation tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/rotate",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Rotator - Free Online Tool",
    description: "Rotate images by 90, 180, or 270 degrees online for free. Easy-to-use image rotation tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/rotate",
  },
};

export default function RotateImagePage() {
  return <RotateImage />;
}
