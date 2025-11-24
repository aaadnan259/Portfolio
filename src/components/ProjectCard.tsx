"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
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
            className="group bg-background border border-surface rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]"
        >
            <div className="p-8">
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
        </motion.div>
    );
}
