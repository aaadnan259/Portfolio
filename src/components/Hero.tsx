"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Github, Linkedin } from "lucide-react";

export default function Hero() {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 motion-safe:animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 motion-safe:animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Headshot */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center lg:justify-end order-2 lg:order-1"
                    >
                        <div className="relative">
                            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl shadow-primary/20">
                                <Image
                                    src="/images/headshot.webp"
                                    alt="Adnan Ashraf"
                                    fill
                                    className="object-cover rounded-full"
                                    priority
                                />
                            </div>
                            {/* Decorative ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 motion-safe:animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <div className="text-center lg:text-left order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="text-primary font-medium text-lg mb-4 tracking-wide uppercase">
                                Hello, I&apos;m
                            </p>
                            <h1 className="text-5xl md:text-7xl font-bold text-text-light mb-6 tracking-tight">
                                Adnan Ashraf
                            </h1>
                            <p className="text-2xl md:text-3xl text-text mb-8 font-light">
                                <span className="text-secondary">AI / Machine Learning Engineer</span>
                            </p>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-lg text-text/80 mb-10 leading-relaxed"
                        >
                            I build production-grade Generative AI systems, RAG pipelines, and backend services that translate machine learning into measurable business value. I focus on scalable, reliable systems from API design to deployment.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
                        >
                            <Link
                                href="#projects"
                                className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all flex items-center gap-2 group"
                            >
                                View Projects
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="/AdnanAshraf_Resume.pdf"
                                download
                                className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-full font-medium transition-all hover:brightness-110 hover:scale-105 flex items-center gap-2"
                            >
                                Download Resume
                                <Download size={18} />
                            </a>
                            <div className="flex items-center gap-4 sm:ml-2">
                                <a
                                    href="https://github.com/aaadnan259"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="GitHub"
                                    className="p-2 text-text/70 hover:text-primary transition-colors"
                                >
                                    <Github size={24} />
                                </a>
                                <a
                                    href="https://linkedin.com/in/adnan-ashraf-259"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-2 text-text/70 hover:text-primary transition-colors"
                                >
                                    <Linkedin size={24} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
