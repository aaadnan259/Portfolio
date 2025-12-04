'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && (
                <WelcomeScreen onComplete={() => setIsLoading(false)} />
            )}
            {/* Optional: You can hide content until loading is done, 
          or let it render behind the screen. 
          Render behind is usually better for SEO and perception. */}
            {children}
        </>
    );
};
