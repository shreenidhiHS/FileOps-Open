import { Metadata } from "next";
import CompressPDF from "@/components/pdf/compress";

export const metadata: Metadata = {
  title: "PDF Compressor - Free Online PDF Compression Tool | OpenSource Tools",
  description: "Compress PDF files to reduce size while maintaining quality online for free. No registration required. Secure, fast, and easy to use PDF compressor.",
  keywords: "PDF compressor, PDF compression, compress PDF, PDF online, free PDF tools, PDF optimizer",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  openGraph: {
    title: "PDF Compressor - Free Online Tool",
    description: "Compress PDF files to reduce size while maintaining quality online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf/compress",
    siteName: "OpenSource Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Compressor - Free Online Tool",
    description: "Compress PDF files to reduce size while maintaining quality online for free. No registration required.",
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf/compress",
  },
};

export default function CompressPDFPage() {
  return <CompressPDF />;
}
