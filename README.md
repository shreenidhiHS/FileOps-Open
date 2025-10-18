# FileForge - Open Source File Processing Tools

A comprehensive suite of free, open-source file processing tools built with Next.js. Convert, compress, merge, split, and transform files across multiple formats including PDF, images, audio, video, and more.

## 🚀 Features

### PDF Tools
- **PDF to Base64** - Convert PDF files to Base64 encoded strings
- **PDF from Base64** - Convert Base64 strings back to PDF files
- **PDF Merger** - Combine multiple PDF files into one document
- **PDF Splitter** - Split PDF documents by page ranges
- **PDF Compressor** - Reduce PDF file size with quality control

### Image Tools (Coming Soon)
- Image format conversion (JPG, PNG, WebP, GIF, BMP)
- Image resizing and scaling
- Image compression and optimization
- Background removal
- Batch processing

### Audio Tools (Coming Soon)
- Audio format conversion (MP3, WAV, FLAC, AAC, OGG)
- Audio trimming and editing
- Audio compression
- Audio merging and splitting
- Noise reduction

### Video Tools (Coming Soon)
- Video format conversion (MP4, AVI, MOV, WMV, WebM)
- Video compression and optimization
- Video trimming and editing
- Video merging and splitting
- Video stabilization

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Notifications**: Sonner
- **File Processing**: Server-side APIs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/shreenidhiHS/FileOps-Open.git
cd fileforge
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # Page routes
│   │   ├── pdf/           # PDF tools pages
│   │   ├── image/         # Image tools pages (coming soon)
│   │   ├── audio/         # Audio tools pages (coming soon)
│   │   └── video/         # Video tools pages (coming soon)
│   ├── api/               # API routes
│   │   └── pdf/           # PDF processing APIs
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header and Footer
│   └── pdf/               # PDF tool components
├── constants/              # Constants and navigation
│   └── pdf/               # PDF navigation config
├── services/               # Business logic
│   └── pdf/               # PDF processing services
└── lib/                   # Utility functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🌟 Key Features

### Server-Side Processing
All heavy file processing operations are handled on the server to ensure optimal performance and security.

### Responsive Design
Fully responsive design that works perfectly on desktop, tablet, and mobile devices.

### Modern UI
Beautiful, accessible interface built with shadcn/ui components and Tailwind CSS.

### Type Safety
Full TypeScript support for better development experience and fewer bugs.

### SEO Optimized
Comprehensive SEO optimization with proper meta tags, Open Graph, and Twitter Cards.

## 🎨 Design System

The project uses a consistent design system with:
- CSS custom properties for theming
- Dark/light mode support
- Consistent spacing and typography
- Accessible color contrast
- Responsive breakpoints

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

## 📞 Support

- 📧 Email: support@fileforge.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/fileforge/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/fileforge/discussions)

## 🗺️ Roadmap

- [ ] Image processing tools
- [ ] Audio processing tools
- [ ] Video processing tools
- [ ] JSON processing tools
- [ ] Batch processing capabilities
- [ ] API rate limiting
- [ ] User authentication
- [ ] File history and management

---

Made with ❤️ by the FileForge team
