"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface VideoPlayerProps {
    src: string;
    className?: string;
}

export default function VideoPlayer({ src, className = "" }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.5 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isInView) {
                videoRef.current.play().catch(error => {
                    console.log("Autoplay prevented:", error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden bg-surface/20 ${className}`}>
            <video
                ref={videoRef}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                loop
                muted
                playsInline
                onLoadedData={() => setIsLoaded(true)}
            >
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-surface/20 animate-pulse">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background/40 pointer-events-none" />
        </div>
    );
}
