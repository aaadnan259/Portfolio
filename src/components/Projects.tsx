"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import ProjectCard from "./ProjectCard";
import VideoPlayer from "./VideoPlayer";
import { projects } from "@/data/portfolio";

export default function Projects() {
    const featuredProjects = useMemo(() => projects.filter(p => p.video), []);
    const regularProjects = useMemo(() => projects.filter(p => !p.video), []);

    return (
        <section id="projects" className="py-20 bg-surface/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">Featured Projects</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </motion.div>

                {/* Featured Projects with Video - Full Width */}
                <div className="space-y-8 mb-8">
                    {featuredProjects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group bg-background border border-surface rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                {/* Video Container */}
                                <VideoPlayer
                                    src={project.video!}
                                    className="group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Content Container */}
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-text-light group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm text-primary/80 font-medium">{project.subtitle}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link href={project.links.github} className="text-text/60 hover:text-text-light transition-colors" aria-label="View Source Code">
                                                <Github size={20} />
                                            </Link>
                                            <Link href={project.links.demo} className="text-text/60 hover:text-text-light transition-colors" aria-label="View Live Demo">
                                                <ExternalLink size={20} />
                                            </Link>
                                        </div>
                                    </div>

                                    <p className="text-text/80 mb-6 leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
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
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Regular Projects - 2 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {regularProjects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
