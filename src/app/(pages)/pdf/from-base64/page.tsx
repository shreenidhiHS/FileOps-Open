import { Metadata } from "next";
import FromBase64 from "@/components/pdf/from-base64";

export const metadata: Metadata = {
  title: "Base64 to PDF Converter - Free Online Base64 to PDF Tool | OpenSource Tools",
  description: "Convert Base64 encoded strings back to PDF files online for free. No registration required. Secure, fast, and easy to use Base64 to PDF converter.",
  keywords: "Base64 to PDF, PDF converter, Base64 decoder, PDF online, free PDF tools, Base64 decoding",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  openGraph: {
    title: "Base64 to PDF Converter - Free Online Tool",
    description: "Convert Base64 encoded strings back to PDF files online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf/from-base64",
    siteName: "OpenSource Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "Base64 to PDF Converter - Free Online Tool",
    description: "Convert Base64 encoded strings back to PDF files online for free. No registration required.",
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf/from-base64",
  },
};

export default function FromBase64Page() {
  return <FromBase64 />;
}
