import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";
import { videoCategories } from "@/constants/video/video-navigation";

export const metadata: Metadata = {
  title: "Video Tools - Free Online Video Processing | FileOps Open",
  description: "Professional video processing tools for conversion, compression, trimming, merging, volume adjustment, splitting, resizing, cropping, rotation, speed changes, audio extraction, and thumbnail generation. Free and easy to use.",
  keywords: "video tools, video converter, video compression, video trimmer, video merger, volume adjuster, video splitter, video resize, video crop, video rotate, speed changer, audio extraction, thumbnail generator, free online tools",
  authors: [{ name: "FileOps Open" }],
  robots: "index, follow",
  openGraph: {
    title: "Video Tools - Free Online Video Processing",
    description: "Professional video processing tools for conversion, compression, trimming, merging, volume adjustment, splitting, resizing, cropping, rotation, speed changes, audio extraction, and thumbnail generation.",
    type: "website",
    url: "https://fileops-open.vercel.app/video",
    siteName: "FileOps Open",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Tools - Free Online Video Processing",
    description: "Professional video processing tools for conversion, compression, trimming, merging, volume adjustment, splitting, resizing, cropping, rotation, speed changes, audio extraction, and thumbnail generation.",
  },
  alternates: {
    canonical: "https://fileops-open.vercel.app/video",
  },
};

export default function VideoToolsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-80 transition-opacity"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Video className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <h1 
                className="text-4xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                Video Tools
              </h1>
            </div>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Professional video processing tools for conversion, editing, transformation, optimization, and extraction. 
              All tools are free, secure, and work entirely in your browser.
            </p>
          </div>
        </div>

        {/* Tools by Category */}
        <div className="space-y-12">
          {videoCategories.map((category) => (
            <div key={category.name} className="space-y-6">
              <div className="text-center">
                <h2 
                  className="text-2xl font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  {category.name}
                </h2>
                <div 
                  className="w-16 h-1 mx-auto rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.path}
                    className="group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1rem)]"
                  >
                    <div 
                      className="h-full p-6 rounded-xl border transition-all duration-200 group-hover:shadow-lg group-hover:scale-105"
                      style={{ 
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--card)'
                      }}
                    >
                      <div className="text-center space-y-4">
                        <div 
                          className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: 'var(--muted)' }}
                        >
                          <div style={{ color: 'var(--primary)' }}>
                            {tool.icon()}
                          </div>
                        </div>
                        
                        <div>
                          <h3 
                            className="text-lg font-semibold mb-2 group-hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--foreground)' }}
                          >
                            {tool.name}
                          </h3>
                          <p 
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Why Choose Our Video Tools?
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Professional-grade video processing with privacy, security, and ease of use at the core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Video className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                High Quality
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Professional algorithms ensure the best possible video output quality
              </p>
            </div>

            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Video className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Privacy First
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                All processing happens in your browser - your videos never leave your device
              </p>
            </div>

            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Video className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                No Registration
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Start processing videos immediately without creating an account
              </p>
            </div>

            <div className="text-center space-y-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Video className="w-8 h-8" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <h3 
                className="text-xl font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Batch Processing
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Process multiple videos at once to save time and effort
              </p>
            </div>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-16 text-center">
          <h2 
            className="text-2xl font-semibold mb-8"
            style={{ color: 'var(--foreground)' }}
          >
            Supported Video Formats
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['MP4', 'AVI', 'MOV', 'WebM', 'MKV', 'FLV', 'WMV', 'M4V'].map((format) => (
              <span
                key={format}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: 'var(--muted)',
                  color: 'var(--muted-foreground)'
                }}
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
