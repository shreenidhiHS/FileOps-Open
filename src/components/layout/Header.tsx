"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Image, Music, Video, Menu, X } from "lucide-react";
import { navigationItems } from "@/constants/root";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b"
      style={{ 
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200 group"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <IconComponent />
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
            style={{ backgroundColor: 'var(--muted)' }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t"
            style={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)'
            }}
          >
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 transition-colors duration-200"
                    style={{ backgroundColor: 'var(--muted)' }}
                  >
                    <IconComponent />
                    <div>
                      <div style={{ color: 'var(--foreground)' }} className="font-medium">
                        {item.name}
                      </div>
                      <div style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
