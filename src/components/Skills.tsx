"use client";

import { motion } from "framer-motion";

import { skills } from "@/data/portfolio";

export default function Skills() {
    return (
        <section id="skills" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">Technical Skills</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skills.map((skillGroup, index) => (
                        <motion.div
                            key={skillGroup.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-surface/30 p-6 rounded-xl border border-surface hover:border-primary/30 transition-colors"
                        >
                            <h3 className="text-xl font-bold text-primary mb-6 text-center">{skillGroup.category}</h3>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {skillGroup.items.map((item) => (
                                    <span key={item.name} className="px-3 py-1.5 bg-surface text-text/80 rounded-full text-sm font-medium border border-surface hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-colors cursor-default flex items-center gap-2">
                                        <i className={`${item.icon} text-lg`} />
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
