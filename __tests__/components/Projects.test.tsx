import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Projects from '../../src/components/Projects';
import React from 'react';

// Mock next/image
vi.mock('next/image', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: (props: any) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img {...props} alt={props.alt || 'mocked image'} />
    )
}));

// Mock next/link
vi.mock('next/link', () => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('Projects Component', () => {
    it('renders without crashing', () => {
        render(<Projects />);
        const heading = screen.getByText(/Featured Projects/i);
        expect(heading).toBeDefined();
    });

    it('renders all projects', () => {
        render(<Projects />);
        // Check for specific project titles from the data file
        expect(screen.getByText('EchoBot')).toBeDefined();
        expect(screen.getByText('GraphRAG Engine')).toBeDefined();
        expect(screen.getByText('IntelliStock')).toBeDefined();
        expect(screen.getByText('Generative Metaball Engine')).toBeDefined();
    });

    it('performance check', () => {
        const start = performance.now();
        render(<Projects />);
        const end = performance.now();
        console.log(`Projects render time: ${end - start}ms`);
        // Just a sanity check, actual performance varies by environment
        expect(end - start).toBeLessThan(500);
    });
});
