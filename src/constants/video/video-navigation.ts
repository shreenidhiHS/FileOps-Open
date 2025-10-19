import { Video, Minus, Scissors, Merge, Volume2, VolumeX, Play, RotateCw, Maximize, Crop } from "lucide-react";
import React from "react";

export interface VideoTool {
    id: number;
    name: string;
    path: string;
    description: string;
    icon: () => React.JSX.Element;
    category: string;
}

export const videoTools: VideoTool[] = [
    {
        id: 1,
        name: "Video Converter",
        path: "/video/convert",
        description: "Convert video files between different formats (MP4, AVI, MOV, WebM, MKV)",
        icon: () => React.createElement(Video, { className: "w-6 h-6" }),
        category: "Convert"
    },
    {
        id: 2,
        name: "Video Compression",
        path: "/video/compress",
        description: "Reduce video file size while maintaining quality and clarity",
        icon: () => React.createElement(Minus, { className: "w-6 h-6" }),
        category: "Optimize"
    },
    {
        id: 3,
        name: "Video Trimmer",
        path: "/video/trim",
        description: "Cut and trim video files to specific time ranges",
        icon: () => React.createElement(Scissors, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 4,
        name: "Video Merger",
        path: "/video/merge",
        description: "Combine multiple video files into a single video",
        icon: () => React.createElement(Merge, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 5,
        name: "Volume Adjuster",
        path: "/video/volume",
        description: "Increase or decrease video audio volume levels",
        icon: () => React.createElement(Volume2, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 6,
        name: "Video Splitter",
        path: "/video/split",
        description: "Split video files into multiple segments",
        icon: () => React.createElement(Scissors, { className: "w-6 h-6" }),
        category: "Edit"
    },
    {
        id: 7,
        name: "Video Resize",
        path: "/video/resize",
        description: "Resize video dimensions while maintaining aspect ratio",
        icon: () => React.createElement(Maximize, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 8,
        name: "Video Crop",
        path: "/video/crop",
        description: "Crop video to specific dimensions or aspect ratios",
        icon: () => React.createElement(Crop, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 9,
        name: "Video Rotate",
        path: "/video/rotate",
        description: "Rotate video by 90, 180, or 270 degrees",
        icon: () => React.createElement(RotateCw, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 10,
        name: "Speed Changer",
        path: "/video/speed",
        description: "Change video playback speed without affecting audio pitch",
        icon: () => React.createElement(Play, { className: "w-6 h-6" }),
        category: "Transform"
    },
    {
        id: 11,
        name: "Audio Extraction",
        path: "/video/extract-audio",
        description: "Extract audio track from video files",
        icon: () => React.createElement(VolumeX, { className: "w-6 h-6" }),
        category: "Extract"
    },
    {
        id: 12,
        name: "Thumbnail Generator",
        path: "/video/thumbnail",
        description: "Generate thumbnail images from video frames",
        icon: () => React.createElement(Video, { className: "w-6 h-6" }),
        category: "Extract"
    }
];

export const videoCategories = [
    {
        name: "Convert",
        tools: videoTools.filter(tool => tool.category === "Convert")
    },
    {
        name: "Edit",
        tools: videoTools.filter(tool => tool.category === "Edit")
    },
    {
        name: "Transform",
        tools: videoTools.filter(tool => tool.category === "Transform")
    },
    {
        name: "Optimize",
        tools: videoTools.filter(tool => tool.category === "Optimize")
    },
    {
        name: "Extract",
        tools: videoTools.filter(tool => tool.category === "Extract")
    }
];

export default videoTools;
