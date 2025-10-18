import Link from "next/link";
import { FileText, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer 
      className="w-full border-t"
      style={{ 
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, var(--primary), var(--chart-1))'
                }}
              >
                <FileText className="w-6 h-6" style={{ color: 'var(--primary-foreground)' }} />
              </div>
              <span 
                className="text-xl font-bold"
                style={{ color: 'var(--foreground)' }}
              >
                OpenSource Tools
              </span>
            </Link>
            <p 
              className="text-lg leading-relaxed mb-6 max-w-md"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Professional-grade online tools for PDF, image, audio, and video processing. 
              Free, secure, and no registration required.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                style={{ backgroundColor: 'var(--muted)' }}
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                style={{ backgroundColor: 'var(--muted)' }}
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </a>
              <a
                href="mailto:contact@opensource-tools.com"
                className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                style={{ backgroundColor: 'var(--muted)' }}
                aria-label="Email"
              >
                <Mail className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              </a>
            </div>
          </div>

          {/* Tools Section */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Tools
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/pdf"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link 
                  href="/image"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Image Tools
                </Link>
              </li>
              <li>
                <Link 
                  href="/audio"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Audio Tools
                </Link>
              </li>
              <li>
                <Link 
                  href="/video"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Video Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="hover:opacity-80 transition-opacity duration-200"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div 
          className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <p 
            className="text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            © {new Date().getFullYear()} OpenSource Tools. All rights reserved.
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Made with ❤️ for the open source community
          </p>
        </div>
      </div>
    </footer>
  );
}
