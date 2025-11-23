"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

const projects = [
    {
        title: "Generative AI Artwork",
        subtitle: "Real-Time Metaball Fluid Visuals for Raspberry Pi",
        description: "A fully-optimized generative art engine designed specifically for Raspberry Pi 4/5. Renders real-time metaball fluid visuals using NumPy-accelerated field calculations, a custom Pi-friendly render pipeline, threaded autosaving, and an optional gallery slideshow/video mode. Built for 24/7 art installations, digital galleries, senior design expos, and generative display walls.",
        tags: ["Python", "NumPy", "Raspberry Pi", "OpenCV", "Computer Vision", "Real-Time Graphics"],
        links: { demo: "#", github: "https://github.com/aaadnan259/Generative-AI-Artwork" },
        video: "/videos/generative-art-demo.mp4"
    },
    {
        title: "IntelliStock",
        subtitle: "AI Powered Inventory Management System",
        description: "Architected a full-stack inventory management application providing real-time stock tracking and data visualization. Implemented predictive ordering using scikit-learn to forecast future needs.",
        tags: ["Python", "Django", "React", "PostgreSQL", "Scikit-learn"],
        links: { demo: "#", github: "#" } // Placeholders as no links provided
    },
    {
        title: "EchoBot",
        subtitle: "AI Voice Powered Virtual Assistant",
        description: "Built a conversational AI assistant using NLP libraries and ElevenLabs API. Engineered the assistant to perform tasks like setting reminders and answering queries with 95% accuracy.",
        tags: ["Python", "NLP", "ElevenLabs API", "NLTK", "spaCy"],
        links: { demo: "#", github: "https://github.com/aaadnan259/EchoBot" }
    },
    {
        title: "Wild Wings and Things",
        subtitle: "Local Business Website",
        description: "Designed and deployed a responsive, user-friendly website for a local business, ensuring a modern digital presence.",
        tags: ["React", "JavaScript", "HTML", "CSS"],
        links: { demo: "#", github: "#" }
    },
    {
        title: "Rocky Ridge Development",
        subtitle: "Real Estate Development Site",
        description: "Developed a professional website for a development company, focusing on showcasing their portfolio and services.",
        tags: ["React", "JavaScript", "HTML", "CSS"],
        links: { demo: "#", github: "#" }
    }
];

export default function Projects() {
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
                    {projects.filter(p => p.video).map((project, index) => (
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
                                <div className="relative overflow-hidden bg-surface/20">
                                    <video
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    >
                                        <source src={project.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background/40 pointer-events-none" />
                                </div>

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
                                            <Link href={project.links.github} className="text-text/60 hover:text-text-light transition-colors">
                                                <Github size={20} />
                                            </Link>
                                            <Link href={project.links.demo} className="text-text/60 hover:text-text-light transition-colors">
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
                    {projects.filter(p => !p.video).map((project, index) => (
                        <motion.div
                            key={index}
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
                                        <Link href={project.links.github} className="text-text/60 hover:text-text-light transition-colors">
                                            <Github size={20} />
                                        </Link>
                                        <Link href={project.links.demo} className="text-text/60 hover:text-text-light transition-colors">
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
                    ))}
                </div>
            </div>
        </section>
    );
}
