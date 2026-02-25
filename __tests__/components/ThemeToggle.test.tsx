import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ThemeToggle from '../../src/components/ThemeToggle';
import * as nextThemes from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
    useTheme: vi.fn()
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    Sun: () => <div data-testid="sun-icon" />,
    Moon: () => <div data-testid="moon-icon" />
}));

describe('ThemeToggle Component', () => {
    let mockSetTheme: ReturnType<typeof vi.fn> | any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockSetTheme = vi.fn();
        // Setup default mock implementation
        vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme as any,
            themes: ['light', 'dark', 'system'],
            systemTheme: 'light'
        });

        // Mock setTimeout to fire immediately to bypass the mounted delay
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders placeholder initially before mounting', () => {
        // useRealTimers for just this test to capture the unmounted state
        vi.useRealTimers();

        const { container } = render(<ThemeToggle />);

        // Before setTimeout fires, it renders an empty div with w-9 h-9
        expect(container.querySelector('.w-9.h-9')).toBeDefined();
        expect(screen.queryByRole('button', { name: /toggle theme/i })).toBeNull();
    });

    it('renders the sun icon when theme is dark', () => {
        vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme as any,
            themes: [],
        });

        render(<ThemeToggle />);

        // Fast forward the setTimeout to mount the component
        act(() => {
            vi.runAllTimers();
        });

        expect(screen.getByTestId('sun-icon')).toBeDefined();
        expect(screen.queryByTestId('moon-icon')).toBeNull();
    });

    it('renders the moon icon when theme is light', () => {
        vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
            theme: 'light',
            setTheme: mockSetTheme as any,
            themes: [],
        });

        render(<ThemeToggle />);

        act(() => {
            vi.runAllTimers();
        });

        expect(screen.getByTestId('moon-icon')).toBeDefined();
        expect(screen.queryByTestId('sun-icon')).toBeNull();
    });

    it('toggles to dark mode when clicked in light mode', () => {
        render(<ThemeToggle />);

        act(() => {
            vi.runAllTimers();
        });

        const button = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('toggles to light mode when clicked in dark mode', () => {
        vi.spyOn(nextThemes, 'useTheme').mockReturnValue({
            theme: 'dark',
            setTheme: mockSetTheme,
            themes: [],
        });

        render(<ThemeToggle />);

        act(() => {
            vi.runAllTimers();
        });

        const button = screen.getByRole('button', { name: /toggle theme/i });
        fireEvent.click(button);

        expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
});
