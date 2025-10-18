import { Metadata } from "next";
import SplitPDF from "@/components/pdf/split";

export const metadata: Metadata = {
  title: "PDF Splitter - Free Online PDF Split Tool | OpenSource Tools",
  description: "Split PDF documents into multiple files by page ranges online for free. No registration required. Secure, fast, and easy to use PDF splitter.",
  keywords: "PDF splitter, PDF split, split PDF, PDF online, free PDF tools, PDF divider",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  openGraph: {
    title: "PDF Splitter - Free Online Tool",
    description: "Split PDF documents into multiple files by page ranges online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf/split",
    siteName: "OpenSource Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Splitter - Free Online Tool",
    description: "Split PDF documents into multiple files by page ranges online for free. No registration required.",
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf/split",
  },
};

export default function SplitPDFPage() {
  return <SplitPDF />;
}
