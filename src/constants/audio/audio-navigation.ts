import { Music, Minus, Scissors, Merge, Volume2, VolumeX, Play } from "lucide-react";
import React from "react";

export interface AudioTool {
    id: number;
    name: string;
    path: string;
    description: string;
    icon: () => React.JSX.Element;
    category: string;
}

export const audioTools: AudioTool[] = [
    {
        id: 1,
        name: "Audio Converter",
        path: "/audio/convert",
        description: "Convert audio files between different formats (MP3, WAV, FLAC, AAC, OGG)",
        icon: () => React.createElement(Music, { className: "w-6 h-6" }),
        category: "Convert"
    },
    {
        id: 2,
        name: "Audio Compression",
        path: "/audio/compress",
        description: "Reduce audio file size while maintaining quality and clarity",
        icon: () => React.createElement(Minus, { className: "w-6 h-6" }),
        category: "Optimize"
    },
    {
        id: 3,
        name: "Audio Trimmer",
        path: "/audio/trim",
        description: "Cut and trim audio files to specific time ranges",
        icon: () => React.createElement(Scissors, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 4,
        name: "Audio Merger",
        path: "/audio/merge",
        description: "Combine multiple audio files into a single track",
        icon: () => React.createElement(Merge, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 5,
        name: "Volume Adjuster",
        path: "/audio/volume",
        description: "Increase or decrease audio volume levels",
        icon: () => React.createElement(Volume2, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 6,
        name: "Audio Splitter",
        path: "/audio/split",
        description: "Split audio files into multiple segments",
        icon: () => React.createElement(Scissors, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 7,
        name: "Noise Reduction",
        path: "/audio/noise-reduction",
        description: "Remove background noise and improve audio quality",
        icon: () => React.createElement(VolumeX, { className: "w-6 h-6" }),
        category: "Enhance"
    },
    {
        id: 8,
        name: "Audio Speed Changer",
        path: "/audio/speed",
        description: "Change playback speed without affecting pitch",
        icon: () => React.createElement(Play, { className: "w-6 h-6" }),
        category: "Transform"
    }
];

export const audioCategories = [
    {
        name: "Convert",
        tools: audioTools.filter(tool => tool.category === "Convert")
    },
    {
        name: "Edit",
        tools: audioTools.filter(tool => tool.category === "Edit")
    },
    {
        name: "Transform",
        tools: audioTools.filter(tool => tool.category === "Transform")
    },
    {
        name: "Optimize",
        tools: audioTools.filter(tool => tool.category === "Optimize")
    },
    {
        name: "Enhance",
        tools: audioTools.filter(tool => tool.category === "Enhance")
    }
];

export default audioTools;
