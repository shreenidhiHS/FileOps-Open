import Link from "next/link";
import { Metadata } from "next";
import { FileText, ArrowLeft } from "lucide-react";
import { pdfCategories } from "@/constants/pdf/pdf-navigation";

export const metadata: Metadata = {
  title: "PDF Tools - Convert, Compress, Split & Merge PDFs Online | OpenSource Tools",
  description: "Free online PDF tools for converting to/from Base64, compressing, splitting, and merging PDF files. No registration required. Secure and fast PDF processing.",
  keywords: "PDF tools, PDF converter, PDF compressor, PDF split, PDF merge, Base64 PDF, PDF online, free PDF tools",
  authors: [{ name: "OpenSource Tools" }],
  robots: "index, follow",
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
  openGraph: {
    title: "PDF Tools - Free Online PDF Converter & Editor",
    description: "Convert, compress, split, and merge PDF files online for free. No registration required.",
    type: "website",
    url: "https://opensource-tools.com/pdf",
    siteName: "OpenSource Tools",
    images: [
      {
        url: "https://opensource-tools.com/og-pdf-tools.jpg",
        width: 1200,
        height: 630,
        alt: "PDF Tools - Free Online PDF Converter & Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools - Free Online PDF Converter & Editor",
    description: "Convert, compress, split, and merge PDF files online for free. No registration required.",
    images: ["https://opensource-tools.com/og-pdf-tools.jpg"],
  },
  alternates: {
    canonical: "https://opensource-tools.com/pdf",
  },
};

export default function PDFToolsPage() {
  return (
    <div className="py-16">
      {/* Page Header */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <span style={{ color: 'var(--muted-foreground)' }}>Back to Tools</span>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div 
              className="flex items-center justify-center w-20 h-20 rounded-3xl mb-4"
              style={{ 
                background: 'linear-gradient(135deg, var(--primary), var(--chart-1))'
              }}
            >
              <FileText className="w-10 h-10" style={{ color: 'var(--primary-foreground)' }} />
            </div>
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            PDF Tools
          </h1>
          <p 
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Professional PDF processing tools for converting, compressing, splitting, and merging documents. 
            Free, secure, and no registration required.
          </p>
        </div>
      </section>

      {/* Tools by Category */}
      <main className="container mx-auto px-4 pb-16">
        {pdfCategories.map((category, categoryIndex) => (
          <div key={category.name} className="mb-16">
            <h2 
              className="text-2xl font-bold mb-8 text-center"
              style={{ color: 'var(--foreground)' }}
            >
              {category.name}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {category.tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="group block w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-sm"
                  >
                    <div 
                      className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full"
                      style={{ 
                        backgroundColor: 'var(--card)',
                        color: 'var(--card-foreground)',
                        borderColor: 'var(--border)',
                        borderWidth: '1px'
                      }}
                    >
                      {/* Icon */}
                      <div 
                        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--primary), var(--chart-1))'
                        }}
                      >
                        <IconComponent />
                      </div>
                      
                      {/* Title */}
                      <h3 
                        className="text-xl font-bold mb-3 text-center transition-colors duration-300"
                        style={{ 
                          color: 'var(--foreground)'
                        }}
                      >
                        {tool.name}
                      </h3>
                      
                      {/* Description */}
                      <p 
                        className="text-center leading-relaxed mb-6"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {tool.description}
                      </p>
                      
                      {/* Hover Arrow */}
                      <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--muted)' }}
                        >
                          <svg
                            className="w-4 h-4"
                            style={{ color: 'var(--muted-foreground)' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Features Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--muted)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 
              className="text-3xl font-bold mb-8"
              style={{ color: 'var(--foreground)' }}
            >
              Why Choose Our PDF Tools?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <svg className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Secure & Private
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  All processing happens in your browser. Files never leave your device.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <svg className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Fast Processing
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  Lightning-fast PDF processing powered by modern web technologies.
                </p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <svg className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Free Forever
                </h3>
                <p style={{ color: 'var(--muted-foreground)' }}>
                  No registration, no subscriptions, no hidden costs. Completely free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
