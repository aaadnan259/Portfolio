"use client";

import { motion } from "framer-motion";

const skills = [
    {
        category: "Languages",
        items: ["Python", "Java", "JavaScript", "C", "HTML/CSS", "SQL"]
    },
    {
        category: "Frameworks & Libraries",
        items: ["React", "Next.js", "Django", "Pandas", "Scikit-learn", "Tailwind CSS"]
    },
    {
        category: "Tools & Platforms",
        items: ["Git & GitHub", "Jira", "AWS", "VS Code", "PostgreSQL"]
    },
    {
        category: "Concepts",
        items: ["RESTful APIs", "Machine Learning", "NLP", "Data Analytics", "Agile/Scrum", "OOP"]
    }
];

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
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-surface/30 p-6 rounded-xl border border-surface hover:border-primary/30 transition-colors"
                        >
                            <h3 className="text-xl font-bold text-primary mb-6 text-center">{skillGroup.category}</h3>
                            <ul className="space-y-3">
                                {skillGroup.items.map((item, i) => (
                                    <li key={i} className="flex items-center justify-center text-text/80 bg-surface rounded-lg py-2 px-3 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
