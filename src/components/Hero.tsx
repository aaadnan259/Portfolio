"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-primary font-medium text-lg mb-4 tracking-wide uppercase">
                        Hello, I'm
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-bold text-text-light mb-6 tracking-tight">
                        Adnan Ashraf
                    </h1>
                    <h3 className="text-2xl md:text-3xl text-text mb-8 font-light">
                        Software Developer & <span className="text-secondary">Project Manager Intern</span>
                    </h3>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg text-text/80 mb-10 leading-relaxed"
                >
                    I build responsive, user-friendly websites and robust software applications.
                    Passionate about full-stack development, AI, and creating seamless digital experiences.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="#projects"
                        className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all flex items-center gap-2 group"
                    >
                        View Projects
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#contact"
                        className="px-8 py-3 bg-secondary hover:bg-secondary/90 text-white rounded-full font-medium transition-all hover:brightness-110 hover:scale-105"
                    >
                        Contact Me
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
