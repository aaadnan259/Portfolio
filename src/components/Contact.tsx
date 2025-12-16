"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(1, "Message is required").max(5000, "Message must be less than 5000 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus("success");
                setErrorMessage("");
                reset();
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                setStatus("error");
                setErrorMessage(result.error || "Something went wrong");
                console.error("Error:", result.error);
                setTimeout(() => {
                    setStatus("idle");
                    setErrorMessage("");
                }, 5000);
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Network error. Please try again.");
            console.error("Error submitting form:", error);
            setTimeout(() => {
                setStatus("idle");
                setErrorMessage("");
            }, 5000);
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
                        <h3 className="text-2xl font-bold text-text-light mb-6">Let&apos;s Connect</h3>
                        <p className="text-text/80 text-lg leading-relaxed mb-8">
                            I&apos;m currently looking for new opportunities. Whether you have a question or just want to say hi,
                            I&apos;ll try my best to get back to you!
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
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-text/80 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name")}
                                    suppressHydrationWarning
                                    className={cn(
                                        "w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30",
                                        errors.name ? "border-red-500" : "border-surface"
                                    )}
                                    placeholder="Your name"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text/80 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    suppressHydrationWarning
                                    className={cn(
                                        "w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30",
                                        errors.email ? "border-red-500" : "border-surface"
                                    )}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-text/80 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    {...register("message")}
                                    suppressHydrationWarning
                                    className={cn(
                                        "w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text placeholder:text-text/30 resize-none",
                                        errors.message ? "border-red-500" : "border-surface"
                                    )}
                                    placeholder="Your message..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : status === "success" ? (
                                        "Message Sent! ✓"
                                    ) : status === "error" ? (
                                        "Failed to Send"
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                                {errorMessage && (
                                    <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
