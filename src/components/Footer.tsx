"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/config";

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-surface/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-text-light mb-2">Adnan Ashraf</h3>
                        <p className="text-text/60 text-sm">
                            © {new Date().getFullYear()} Adnan Ashraf. All rights reserved.
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <Link
                            href="https://github.com/aaadnan259"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text/60 hover:text-primary transition-colors"
                            aria-label="GitHub"
                        >
                            <Github size={24} />
                        </Link>
                        <Link
                            href="https://linkedin.com/in/adnan-ashraf-259"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text/60 hover:text-primary transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={24} />
                        </Link>
                        <Link
                            href={`mailto:${PUBLIC_CONTACT_EMAIL}`}
                            className="text-text/60 hover:text-primary transition-colors"
                            aria-label="Email"
                        >
                            <Mail size={24} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
