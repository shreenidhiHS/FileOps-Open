import { FileText, Download, Upload, Minus, Scissors, Merge } from "lucide-react";
import React from "react";

export interface PDFTool {
    id: number;
    name: string;
    path: string;
    description: string;
    icon: () => React.JSX.Element;
    category: string;
}

export const pdfTools: PDFTool[] = [
    {
        id: 1,
        name: "PDF to Base64",
        path: "/pdf/to-base64",
        description: "Convert PDF files to Base64 encoded string for easy sharing and embedding",
        icon: () => React.createElement(FileText, { className: "w-6 h-6" }),
        category: "Convert"
    },
    {
        id: 2,
        name: "PDF from Base64",
        path: "/pdf/from-base64",
        description: "Convert Base64 encoded string back to PDF file format",
        icon: () => React.createElement(Download, { className: "w-6 h-6" }),
        category: "Convert"
    },
    {
        id: 3,
        name: "PDF Compression",
        path: "/pdf/compress",
        description: "Reduce PDF file size while maintaining quality and readability",
        icon: () => React.createElement(Minus, { className: "w-6 h-6" }),
        category: "Optimize"
    },
    {
        id: 4,
        name: "PDF Split",
        path: "/pdf/split",
        description: "Split PDF documents into multiple files by pages or custom ranges",
        icon: () => React.createElement(Scissors, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 5,
        name: "PDF Merge",
        path: "/pdf/merge",
        description: "Combine multiple PDF files into a single document",
        icon: () => React.createElement(Merge, { className: "w-6 h-6" }),
        category: "Edit"
    }
];

export const pdfCategories = [
    { name: "Convert", tools: pdfTools.filter(tool => tool.category === "Convert") },
    { name: "Edit", tools: pdfTools.filter(tool => tool.category === "Edit") },
    { name: "Optimize", tools: pdfTools.filter(tool => tool.category === "Optimize") }
];

export default pdfTools;
