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
                        I am a Computer Science Engineering Technology student at the University of Toledo (Expected Dec 2025), passionate about building scalable, full-stack web solutions. As a Software Developer Intern, I have hands-on experience engineering RESTful APIs, optimizing front-end performance with React, and deploying applications in Agile environments. I thrive on solving complex algorithmic challenges using Python and Java, and I am dedicated to leveraging cloud technologies and AI integration to create impactful digital experiences.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
