
import { FileText, Image, Music, Video } from "lucide-react";
import React from "react";

export interface NavigationItem {
    id: number;
    name: string;
    path: string;
    description: string;
    meta: {
        title: string;
        description: string;
        keywords: string;
        author: string;
        robots: string;
        canonical: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
        twitterCard?: string;
        twitterTitle?: string;
        twitterDescription?: string;
    };
    icon: () => React.JSX.Element;
}

export const navigationItems: NavigationItem[] = [
    {
        id: 1,
        name: "PDF Tools",
        path: "/pdf",
        description: "Comprehensive PDF manipulation and conversion tools",
        meta: {
            title: "PDF Tools - Convert, Edit, Merge, Split PDFs Online | OpenSource Tools",
            description: "Free online PDF tools for converting, editing, merging, splitting, and compressing PDF files. No registration required. Secure and fast PDF processing.",
            keywords: "PDF tools, PDF converter, PDF editor, PDF merge, PDF split, PDF compress, PDF to Word, Word to PDF, PDF online",
            author: "OpenSource Tools",
            robots: "index, follow",
            canonical: "https://opensource-tools.com/pdf",
            ogTitle: "PDF Tools - Free Online PDF Converter & Editor",
            ogDescription: "Convert, edit, merge, split, and compress PDF files online for free. No registration required.",
            ogImage: "https://opensource-tools.com/og-pdf-tools.jpg",
            twitterCard: "summary_large_image",
            twitterTitle: "PDF Tools - Free Online PDF Converter & Editor",
            twitterDescription: "Convert, edit, merge, split, and compress PDF files online for free."
        },
        icon: () => React.createElement(FileText, { className: "w-6 h-6" })
    },
    {
        id: 2,
        name: "Image Tools",
        path: "/image",
        description: "Professional image editing and conversion tools",
        meta: {
            title: "Image Tools - Resize, Convert, Edit Images Online | OpenSource Tools",
            description: "Free online image tools for resizing, converting, editing, and optimizing images. Support for JPG, PNG, GIF, WebP, and more formats.",
            keywords: "image tools, image converter, image resizer, image editor, image compressor, JPG to PNG, PNG to JPG, image optimization",
            author: "OpenSource Tools",
            robots: "index, follow",
            canonical: "https://opensource-tools.com/image",
            ogTitle: "Image Tools - Free Online Image Converter & Editor",
            ogDescription: "Resize, convert, edit, and optimize images online for free. Support for all major image formats.",
            ogImage: "https://opensource-tools.com/og-image-tools.jpg",
            twitterCard: "summary_large_image",
            twitterTitle: "Image Tools - Free Online Image Converter & Editor",
            twitterDescription: "Resize, convert, edit, and optimize images online for free."
        },
        icon: () => React.createElement(Image, { className: "w-6 h-6" })
    },
    {
        id: 3,
        name: "Audio Tools",
        path: "/audio",
        description: "Professional audio editing and conversion tools",
        meta: {
            title: "Audio Tools - Convert, Edit, Compress Audio Online | OpenSource Tools",
            description: "Free online audio tools for converting, editing, compressing, and processing audio files. Support for MP3, WAV, FLAC, and more formats.",
            keywords: "audio tools, audio converter, audio editor, MP3 converter, WAV converter, audio compressor, audio trimmer, audio merger",
            author: "OpenSource Tools",
            robots: "index, follow",
            canonical: "https://opensource-tools.com/audio",
            ogTitle: "Audio Tools - Free Online Audio Converter & Editor",
            ogDescription: "Convert, edit, compress, and process audio files online for free. Support for all major audio formats.",
            ogImage: "https://opensource-tools.com/og-audio-tools.jpg",
            twitterCard: "summary_large_image",
            twitterTitle: "Audio Tools - Free Online Audio Converter & Editor",
            twitterDescription: "Convert, edit, compress, and process audio files online for free."
        },
        icon: () => React.createElement(Music, { className: "w-6 h-6" })
    },
    {
        id: 4,
        name: "Video Tools",
        path: "/video",
        description: "Professional video editing and conversion tools",
        meta: {
            title: "Video Tools - Convert, Edit, Compress Video Online | OpenSource Tools",
            description: "Free online video tools for converting, editing, compressing, and processing video files. Support for MP4, AVI, MOV, and more formats.",
            keywords: "video tools, video converter, video editor, MP4 converter, video compressor, video trimmer, video merger, video resizer",
            author: "OpenSource Tools",
            robots: "index, follow",
            canonical: "https://opensource-tools.com/video",
            ogTitle: "Video Tools - Free Online Video Converter & Editor",
            ogDescription: "Convert, edit, compress, and process video files online for free. Support for all major video formats.",
            ogImage: "https://opensource-tools.com/og-video-tools.jpg",
            twitterCard: "summary_large_image",
            twitterTitle: "Video Tools - Free Online Video Converter & Editor",
            twitterDescription: "Convert, edit, compress, and process video files online for free."
        },
        icon: () => React.createElement(Video, { className: "w-6 h-6" })
    }
];

export default navigationItems;