import { Metadata } from "next";
import MergePDF from "@/components/pdf/merge";

export const metadata: Metadata = {
  title: "PDF Merger - Free Online PDF Merge Tool | OpenSource Tools",
  description: "Merge multiple PDF files into a single document online for free. No registration required. Secure, fast, and easy to use PDF merger.",
  keywords: "PDF merger, PDF combine, merge PDF, PDF online, free PDF tools, PDF joiner",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  openGraph: {
    title: "PDF Merger - Free Online Tool",
    description: "Merge multiple PDF files into a single document online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf/merge",
    siteName: "OpenSource Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Merger - Free Online Tool",
    description: "Merge multiple PDF files into a single document online for free. No registration required.",
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf/merge",
  },
};

export default function MergePDFPage() {
  return <MergePDF />;
}
