import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenSource Tools - Free Online PDF, Image, Audio & Video Tools",
  description: "Professional-grade online tools for PDF, image, audio, and video processing. Free, secure, and no registration required.",
  keywords: "online tools, PDF tools, image tools, audio tools, video tools, file converter, free tools, open source",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  openGraph: {
    title: "OpenSource Tools - Free Online File Processing Tools",
    description: "Professional-grade online tools for PDF, image, audio, and video processing. Free, secure, and no registration required.",
    type: "website",
    url: "https://opensource-tools.com",
    siteName: "OpenSource Tools",
    images: [
      {
        url: "https://opensource-tools.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OpenSource Tools - Free Online File Processing Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSource Tools - Free Online File Processing Tools",
    description: "Professional-grade online tools for PDF, image, audio, and video processing. Free, secure, and no registration required.",
    images: ["https://opensource-tools.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://opensource-tools.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)'
        }}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
