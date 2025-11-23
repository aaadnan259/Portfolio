"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                console.error("Error:", data.error);
                setTimeout(() => setStatus("idle"), 5000);
            }
        } catch (error) {
            setStatus("error");
            console.error("Error submitting form:", error);
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section id="contact" className="py-20 bg-surface/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">Get In Touch</h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <h3 className="text-2xl font-bold text-text-light mb-6">Let's Connect</h3>
                        <p className="text-text/80 text-lg leading-relaxed mb-8">
                            I'm currently looking for new opportunities. Whether you have a question or just want to say hi,
                            I'll try my best to get back to you!
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-text/90">
                                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-primary">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-text/60">Email</p>
                                    <a href="mailto:aaadnan259@gmail.com" className="font-medium hover:text-primary transition-colors">
                                        aaadnan259@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-text/90">
                                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-primary">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-text/60">Phone</p>
                                    <a href="tel:4193201540" className="font-medium hover:text-primary transition-colors">
                                        (419) 320-1540
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-text/90">
                                <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-text/60">Location</p>
                                    <p className="font-medium">Perrysburg, Ohio</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-surface p-8 rounded-2xl border border-surface/50"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text/80 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text/80 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text/80 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-surface rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30 resize-none"
                                    placeholder="Your message..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "submitting" ? (
                                    "Sending..."
                                ) : status === "success" ? (
                                    "Message Sent! ✓"
                                ) : status === "error" ? (
                                    "Failed to Send - Try Again"
                                ) : (
                                    <>
                                        Send Message
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
