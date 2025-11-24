"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

import { experiences } from "@/data/portfolio";

export default function Experience() {
    return (
        <section id="experience" className="py-20 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">Experience & Education</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </motion.div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-surface" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-8 h-8 bg-surface border-2 border-primary rounded-full flex items-center justify-center z-10">
                                    <exp.icon size={14} className="text-primary" />
                                </div>

                                {/* Content */}
                                <div className="ml-12 md:ml-0 md:w-1/2">
                                    <div className={`bg-surface/50 p-6 rounded-xl border border-surface hover:border-primary/30 transition-colors ${index % 2 === 0 ? "md:mr-12" : "md:ml-12"
                                        }`}>
                                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                                            {exp.date}
                                        </span>
                                        <h3 className="text-xl font-bold text-text-light mb-1">{exp.title}</h3>
                                        <div className="flex items-center gap-3 mb-4">
                                            {exp.logo && (
                                                <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1">
                                                    <img
                                                        src={exp.logo}
                                                        alt={`${exp.company} logo`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                            <h4 className="text-lg text-text/80">{exp.company} | {exp.location}</h4>
                                        </div>
                                        <ul className="space-y-2">
                                            {exp.description.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-text/70 text-sm">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

