import { render, screen } from '@testing-library/react';
import Skills from '../../src/components/Skills';
import { describe, it, expect, vi } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    },
}));

describe('Skills Component', () => {
    it('renders without crashing', () => {
        render(<Skills />);
        expect(screen.getByText('Technical Skills')).toBeDefined();
    });

    it('renders skill categories', () => {
        render(<Skills />);
        expect(screen.getByText('Languages')).toBeDefined();
        expect(screen.getByText('Frameworks & Libraries')).toBeDefined();
    });
});
