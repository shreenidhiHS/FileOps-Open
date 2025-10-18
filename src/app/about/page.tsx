import Link from "next/link";
import { ArrowLeft, FileText, Image, Music, Video, Github, Heart, Shield, Zap, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity duration-200"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            About FileOps-Open
          </h1>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            A comprehensive suite of free, open-source file processing tools built with modern web technologies. 
            Convert, compress, merge, split, and transform files across multiple formats.
          </p>
        </div>

        {/* Mission Statement */}
        <Card 
          className="mb-12"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <CardContent className="p-8">
            <h2 
              className="text-2xl font-semibold mb-4 flex items-center gap-3"
              style={{ color: 'var(--foreground)' }}
            >
              <Heart className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              Our Mission
            </h2>
            <p 
              className="text-lg leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              We believe that powerful file processing tools should be accessible to everyone, regardless of technical expertise or budget constraints. 
              Our mission is to provide a comprehensive, free, and open-source platform that empowers users to handle all their file processing needs 
              without compromising on quality, security, or user experience.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-8 text-center"
            style={{ color: 'var(--foreground)' }}
          >
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* PDF Tools */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  PDF Tools
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Convert, merge, split, compress, and transform PDF documents with professional-grade tools.
                </p>
              </CardContent>
            </Card>

            {/* Image Tools */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <Image className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Image Tools
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Resize, convert, compress, crop, and enhance images across all popular formats.
                </p>
              </CardContent>
            </Card>

            {/* Audio Tools */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <Music className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Audio Tools
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Convert, trim, compress, and edit audio files in various formats.
                </p>
              </CardContent>
            </Card>

            {/* Video Tools */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <Video className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Video Tools
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Convert, compress, trim, and enhance video files with advanced processing.
                </p>
              </CardContent>
            </Card>

            {/* Fast Processing */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Fast Processing
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Server-side processing ensures optimal performance and speed for all operations.
                </p>
              </CardContent>
            </Card>

            {/* Mobile Friendly */}
            <Card 
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--primary)' }} />
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  Mobile Friendly
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Fully responsive design that works perfectly on all devices and screen sizes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-12">
          <h2 
            className="text-2xl font-semibold mb-8 text-center"
            style={{ color: 'var(--foreground)' }}
          >
            Why Choose FileOps-Open?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card 
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-xl font-semibold mb-4 flex items-center gap-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Shield className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  Privacy & Security
                </h3>
                <p 
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  All file processing happens securely on our servers with no data retention. 
                  Your files are processed and immediately deleted, ensuring complete privacy.
                </p>
              </CardContent>
            </Card>

            <Card 
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6">
                <h3 
                  className="text-xl font-semibold mb-4 flex items-center gap-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Github className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  Open Source
                </h3>
                <p 
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Built with transparency in mind. Our code is open source, allowing you to 
                  review, contribute, and even host your own instance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technology Stack */}
        <Card 
          className="mb-12"
          style={{ 
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)'
          }}
        >
          <CardContent className="p-8">
            <h2 
              className="text-2xl font-semibold mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              Built with Modern Technology
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  Frontend
                </h3>
                <ul 
                  className="space-y-2"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <li>• Next.js 15 with App Router</li>
                  <li>• React 19 & TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• shadcn/ui components</li>
                  <li>• Lucide React icons</li>
                </ul>
              </div>
              <div>
                <h3 
                  className="text-lg font-semibold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  Backend & Processing
                </h3>
                <ul 
                  className="space-y-2"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <li>• Server-side API routes</li>
                  <li>• Sharp for image processing</li>
                  <li>• Canvas for PDF manipulation</li>
                  <li>• Optimized file handling</li>
                  <li>• Type-safe operations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card 
            className="max-w-2xl mx-auto"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)'
            }}
          >
            <CardContent className="p-8">
              <h2 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                Ready to Get Started?
              </h2>
              <p 
                className="mb-6"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Explore our comprehensive suite of file processing tools. No registration required, 
                completely free, and ready to use right now.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:opacity-90"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Start Processing Files
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
