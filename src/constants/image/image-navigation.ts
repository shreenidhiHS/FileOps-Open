import { Image, Minus, Eraser, RotateCw, FlipHorizontal, Crop, Maximize, Palette, Download, Upload } from "lucide-react";
import React from "react";

export interface ImageTool {
    id: number;
    name: string;
    path: string;
    description: string;
    icon: () => React.JSX.Element;
    category: string;
}

export const imageTools: ImageTool[] = [
    {
        id: 1,
        name: "Image Compression",
        path: "/image/compress",
        description: "Reduce image file size while maintaining quality and visual appeal",
        icon: () => React.createElement(Minus, { className: "w-6 h-6" }),
        category: "Optimize"
    },
    {
        id: 2,
        name: "Background Removal",
        path: "/image/background-removal",
        description: "Remove backgrounds from images automatically using AI",
        icon: () => React.createElement(Eraser, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 3,
        name: "Image Rotate",
        path: "/image/rotate",
        description: "Rotate images by 90, 180, or 270 degrees clockwise or counterclockwise",
        icon: () => React.createElement(RotateCw, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 4,
        name: "Image Flip",
        path: "/image/flip",
        description: "Flip images horizontally or vertically to create mirror effects",
        icon: () => React.createElement(FlipHorizontal, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 5,
        name: "Image Crop",
        path: "/image/crop",
        description: "Crop images to specific dimensions or aspect ratios",
        icon: () => React.createElement(Crop, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 6,
        name: "Image Resize",
        path: "/image/resize",
        description: "Resize images to specific dimensions while maintaining aspect ratio",
        icon: () => React.createElement(Maximize, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 7,
        name: "Format Converter",
        path: "/image/convert",
        description: "Convert images between different formats (JPG, PNG, WebP, GIF, BMP)",
        icon: () => React.createElement(Image, { className: "w-6 h-6" }),
        category: "Convert"
    },
    {
        id: 8,
        name: "Color Adjustments",
        path: "/image/color-adjust",
        description: "Adjust brightness, contrast, saturation, and other color properties",
        icon: () => React.createElement(Palette, { className: "w-6 h-6" }),
        category: "Edit"
    }
];

export const imageCategories = [
    {
        name: "Convert",
        tools: imageTools.filter(tool => tool.category === "Convert")
    },
    {
        name: "Edit",
        tools: imageTools.filter(tool => tool.category === "Edit")
    },
    {
        name: "Transform",
        tools: imageTools.filter(tool => tool.category === "Transform")
    },
    {
        name: "Optimize",
        tools: imageTools.filter(tool => tool.category === "Optimize")
    }
];
