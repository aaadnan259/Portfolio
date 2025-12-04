'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export const WelcomeScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [text, setText] = useState('Hello');

    useEffect(() => {
        // 1. Lock scroll
        document.body.style.overflow = 'hidden';

        // 2. Timeline
        const timer1 = setTimeout(() => {
            setText('I am Adnan Ashraf');
        }, 2000);

        const timer2 = setTimeout(() => {
            onComplete();
            // Unlock scroll is handled by the component unmounting, 
            // but strictly safer to do it in cleanup or after animation.
            // We'll let the cleanup function handle the final unlock 
            // to ensure it stays locked during the exit animation.
        }, 4500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            document.body.style.overflow = 'unset';
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-color),transparent_20%)] to-[color-mix(in_srgb,var(--surface-color),transparent_30%)]"
            // Initial State: Heavy blur, full opacity
            initial={{ opacity: 1, backdropFilter: "blur(20px)" }}
            // Animation: (Optional if you want it to animate in, but usually it starts present)
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            // Exit State: "Unblur" into the website
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={text}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="text-center p-4"
                >
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-text">
                        {text}
                    </h1>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};
