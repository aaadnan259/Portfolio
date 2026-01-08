"use client";

import { motion } from "framer-motion";

export default function About() {
    return (
        <section id="about" className="py-20 bg-surface/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-8">About Me</h2>
                    <p className="text-lg text-text/90 leading-[1.6]">
                        I am a Computer Science graduate from the University of Toledo (Dec 2025), specializing in building production-ready Generative AI systems and scalable backend services. As a Software Engineering Intern, I architected Python-based microservices and REST APIs, optimizing workflows for 50+ daily active users. I have a proven track record of delivering AI-augmented automation, reducing operational tasks by ~30%, and ensuring zero-downtime migrations for critical business operations.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
