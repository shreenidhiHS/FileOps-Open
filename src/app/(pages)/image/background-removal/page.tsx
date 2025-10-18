import BackgroundRemoval from "@/components/image/background-removal";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Background Removal - Free AI Background Removal Tool | FileOps Open",
  description: "Remove backgrounds from images automatically using AI. Free online background removal tool for professional results.",
  keywords: "background removal, remove background, AI background removal, transparent background, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Background Removal - Free AI Tool",
    description: "Remove backgrounds from images automatically using AI. Free online background removal tool.",
    type: "website",
    url: "https://fileops-open.vercel.app/image/background-removal",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Removal - Free AI Tool",
    description: "Remove backgrounds from images automatically using AI. Free online background removal tool.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/image/background-removal",
  },
};

export default function BackgroundRemovalPage() {
  return <BackgroundRemoval />;
}
