import { Metadata } from "next";
import CropImage from "@/components/image/crop";

export const metadata: Metadata = {
  title: "Image Cropper - Free Online Image Crop Tool | FileOps Open",
  description: "Crop images to specific dimensions or aspect ratios online for free. Easy-to-use image cropping tool.",
  keywords: "image cropper, crop image, image crop, aspect ratio, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Cropper - Free Online Tool",
    description: "Crop images to specific dimensions or aspect ratios online for free. Easy-to-use image cropping tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/crop",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Cropper - Free Online Tool",
    description: "Crop images to specific dimensions or aspect ratios online for free. Easy-to-use image cropping tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/crop",
  },
};

export default function CropImagePage() {
  return <CropImage />;
}
