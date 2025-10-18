import { Metadata } from "next";
import ToBase64 from "@/components/pdf/to-base64";

export const metadata: Metadata = {
  title: "PDF to Base64 Converter - Free Online PDF to Base64 Tool | OpenSource Tools",
  description: "Convert PDF files to Base64 encoded strings online for free. No registration required. Secure, fast, and easy to use PDF to Base64 converter.",
  keywords: "PDF to Base64, PDF converter, Base64 encoder, PDF online, free PDF tools, PDF encoding",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  openGraph: {
    title: "PDF to Base64 Converter - Free Online Tool",
    description: "Convert PDF files to Base64 encoded strings online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf/to-base64",
    siteName: "OpenSource Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Base64 Converter - Free Online Tool",
    description: "Convert PDF files to Base64 encoded strings online for free. No registration required.",
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf/to-base64",
  },
};

export default function ToBase64Page() {
  return <ToBase64 />;
}