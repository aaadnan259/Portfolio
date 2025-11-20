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
                    <p className="text-lg text-text/90 leading-relaxed mb-6">
                        I am a Computer Science Engineering Technology student at the University of Toledo,
                        expected to graduate in December 2025. With a strong GPA of 3.3 and a place on the
                        Dean's List, I combine academic excellence with practical experience.
                    </p>
                    <p className="text-lg text-text/90 leading-relaxed">
                        Currently working as a Software Developer and Project Manager Intern at Code Echo,
                        I specialize in full-cycle application development, from designing responsive front-ends
                        to engineering robust back-end APIs. My passion lies in solving complex problems using
                        technologies like Python, Java, and React, and I am always eager to learn and adapt
                        to new challenges in the ever-evolving tech landscape.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
