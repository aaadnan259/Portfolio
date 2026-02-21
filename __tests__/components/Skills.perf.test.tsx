import { render } from '@testing-library/react';
import Skills from '../../src/components/Skills';
import { describe, it, vi } from 'vitest';

// Mock framer-motion to avoid animation delays in tests
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    },
}));

describe('Skills Performance', () => {
    it('renders 100 times', () => {
        const start = performance.now();
        for (let i = 0; i < 100; i++) {
            render(<Skills />);
        }
        const end = performance.now();
        console.log(`Render time for 100 iterations: ${end - start}ms`);
    });
});
