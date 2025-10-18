import { Metadata } from "next";
import CompressImage from "@/components/image/compress";

export const metadata: Metadata = {
  title: "Image Compressor - Free Online Image Compression Tool | FileOps Open",
  description: "Compress images to reduce file size while maintaining quality. Free online image compression tool supporting JPG, PNG, WebP, and more formats.",
  keywords: "image compressor, image compression, reduce image size, compress JPG, compress PNG, image optimizer, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Compressor - Free Online Tool",
    description: "Compress images to reduce file size while maintaining quality. Free online image compression tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/compress",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Compressor - Free Online Tool",
    description: "Compress images to reduce file size while maintaining quality. Free online image compression tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/compress",
  },
};

export default function CompressImagePage() {
  return <CompressImage />;
}
