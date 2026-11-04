"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Skip transform animations for visitors who ask their OS to reduce motion. */}
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
    );
}
