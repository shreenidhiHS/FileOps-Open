import { Metadata } from "next";
import FlipImage from "@/components/image/flip";

export const metadata: Metadata = {
  title: "Image Flipper - Free Online Image Flip Tool | FileOps Open",
  description: "Flip images horizontally or vertically online for free. Easy-to-use image flip tool for creating mirror effects.",
  keywords: "image flipper, flip image, horizontal flip, vertical flip, mirror image, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Image Flipper - Free Online Tool",
    description: "Flip images horizontally or vertically online for free. Easy-to-use image flip tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/flip",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Flipper - Free Online Tool",
    description: "Flip images horizontally or vertically online for free. Easy-to-use image flip tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/flip",
  },
};

export default function FlipImagePage() {
  return <FlipImage />;
}
