import Link from "next/link";
import { Metadata } from "next";
import { navigationItems } from "@/constants/root";

export const metadata: Metadata = {
  title: "OpenSource Tools - Free Online PDF, Image, Audio & Video Tools",
  description: "Free online tools for PDF conversion, image editing, audio processing, and video manipulation. No registration required. Secure, fast, and easy to use.",
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

export default function Home() {
  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            OpenSource Tools
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Professional-grade online tools for PDF, image, audio, and video processing. 
            Free, secure, and no registration required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {navigationItems.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.path}
                className="group block"
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
                  <h2 
                    className="text-xl font-bold mb-3 text-center transition-colors duration-300"
                    style={{ 
                      color: 'var(--foreground)'
                    }}
                  >
                    {tool.name}
                  </h2>
                  
                  {/* Description */}
                  <p 
                    className="text-center leading-relaxed"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {tool.description}
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="flex justify-center mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
      </main>

    </div>
  );
}
