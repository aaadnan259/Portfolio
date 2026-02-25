import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from '../../src/components/Navbar';

// Mock next/image
vi.mock('next/image', () => ({
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    default: (props: any) => <img {...props} />
}));

// Mock ThemeToggle so we don't need its complex context in this specific unit test
vi.mock('@/components/ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle-mock" />
}));

// Mock framer-motion AnimatePresence and motion.div
vi.mock('framer-motion', () => ({
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    }
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
});
window.IntersectionObserver = class {
    constructor() { return mockIntersectionObserver(); }
    observe = () => null;
    unobserve = () => null;
    disconnect = () => null;
} as any;

describe('Navbar Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the logo image', () => {
        render(<Navbar />);
        const logo = screen.getByAltText('Logo');
        expect(logo).toBeDefined();
    });

    it('renders all desktop navigation links', () => {
        render(<Navbar />);

        // These are the exact names used in navLinks array
        const links = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

        links.forEach(linkText => {
            // we have duplicate text between mobile and desktop navs, so we check getAllByText
            const elements = screen.getAllByText(linkText);
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('does not render mobile menu by default', () => {
        render(<Navbar />);
        const mobileMenuContainer = document.querySelector('.md\\:hidden.bg-surface');
        expect(mobileMenuContainer).toBeNull();
    });

    it('opens mobile menu when toggle button is clicked', () => {
        render(<Navbar />);
        const toggleButton = screen.getByRole('button', { name: /toggle mobile menu/i });

        fireEvent.click(toggleButton);

        // Check that mobile menu container is now rendered and has the links
        const mobileHomeLink = screen.getAllByText('Home').find(el => el.classList.contains('text-base'));
        expect(mobileHomeLink).toBeDefined();
    });

    it('closes mobile menu when a mobile link is clicked', () => {
        render(<Navbar />);
        const toggleButton = screen.getByRole('button', { name: /toggle mobile menu/i });

        // Open
        fireEvent.click(toggleButton);

        // Get the "Home" link specifically within the mobile menu container (which has text-base class)
        const mobileHomeLink = screen.getAllByText('Home').find(el => el.classList.contains('text-base'));
        expect(mobileHomeLink).toBeDefined();

        // Click
        fireEvent.click(mobileHomeLink!);

        // Menu should unmount/close
        const mobileMenuContainer = document.querySelector('.md\\:hidden.bg-surface');
        expect(mobileMenuContainer).toBeNull();
    });

    it('registers IntersectionObserver for all valid scroll sections', () => {
        render(<Navbar />);
        expect(mockIntersectionObserver).toHaveBeenCalled();
    });
});
