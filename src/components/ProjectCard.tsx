"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProjectItem } from "@/types";

interface ProjectCardProps {
    project: ProjectItem;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group flex flex-col h-full bg-background border border-surface rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
        >
            {/* MEDIA AREA (Fixed 16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-video bg-surface/50 overflow-hidden border-b border-surface">
                {project.video ? (
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={project.video} type="video/mp4" />
                    </video>
                ) : (
                    <Image
                        src={project.image || "/images/placeholder.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                )}
                {/* Gradient Overlay for professional look */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* CONTENT AREA */}
            <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-text-light group-hover:text-primary transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-sm text-primary/80 font-medium mt-1">{project.subtitle}</p>
                    </div>
                    <div className="flex gap-3 shrink-0 ml-4">
                        {project.links.github && (
                            <Link href={project.links.github} className="text-text/60 hover:text-text-light transition-colors" aria-label="View Source Code" target="_blank" rel="noopener noreferrer">
                                <Github size={20} />
                            </Link>
                        )}
                        {project.links.demo && (
                            <Link href={project.links.demo} className="text-text/60 hover:text-text-light transition-colors" aria-label="View Live Demo" target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={20} />
                            </Link>
                        )}
                    </div>
                </div>

                <p className="text-text/80 mb-6 text-sm leading-relaxed">
                    {project.description}
                </p>

                {/* TAGS (Pushed to bottom) */}
                <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-surface text-xs font-medium text-text/70 rounded-full border border-surface group-hover:border-primary/20 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
