import { Metadata } from "next";
import ColorAdjustImage from "@/components/image/color-adjust";

export const metadata: Metadata = {
  title: "Color Adjuster - Free Online Image Color Adjustment Tool | FileOps Open",
  description: "Adjust brightness, contrast, saturation, and hue of images online for free. Easy-to-use image color adjustment tool.",
  keywords: "color adjuster, brightness, contrast, saturation, hue, image editing, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Color Adjuster - Free Online Tool",
    description: "Adjust brightness, contrast, saturation, and hue of images online for free. Easy-to-use image color adjustment tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/color-adjust",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Adjuster - Free Online Tool",
    description: "Adjust brightness, contrast, saturation, and hue of images online for free. Easy-to-use image color adjustment tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/color-adjust",
  },
};

export default function ColorAdjustImagePage() {
  return <ColorAdjustImage />;
}
