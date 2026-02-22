import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import Contact from '../../src/components/Contact';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        div: ({ children, whileInView, initial, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Mail: () => <span data-testid="icon-mail" />,
    Phone: () => <span data-testid="icon-phone" />,
    MapPin: () => <span data-testid="icon-map-pin" />,
    Send: () => <span data-testid="icon-send" />,
}));

describe('Contact Component', () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        vi.spyOn(global, 'fetch').mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: async () => ({}),
            } as Response)
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the contact form correctly', () => {
        render(<Contact />);

        expect(screen.getByText('Get In Touch')).toBeDefined();
        expect(screen.getByLabelText(/Name/i)).toBeDefined();
        expect(screen.getByLabelText(/Email/i)).toBeDefined();
        expect(screen.getByLabelText(/Message/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /Send Message/i })).toBeDefined();
    });

    it('displays validation errors for empty submission', async () => {
        render(<Contact />);

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 2 characters')).toBeDefined();
            expect(screen.getByText('Please enter a valid email address')).toBeDefined();
            expect(screen.getByText('Message is required')).toBeDefined();
        });
    });

    it('displays validation error when email is empty', async () => {
        render(<Contact />);

        const nameInput = screen.getByLabelText(/Name/i);
        const messageInput = screen.getByLabelText(/Message/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(messageInput, { target: { value: 'Hello' } });
        // Email left empty

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeDefined();
        });
    });

    it('displays validation error for short name', async () => {
        render(<Contact />);

        const nameInput = screen.getByLabelText(/Name/i);
        fireEvent.change(nameInput, { target: { value: 'A' } });

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 2 characters')).toBeDefined();
        });
    });

    it('submits the form successfully', async () => {
        // Use default mock from beforeEach

        render(<Contact />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there!' } });

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'John Doe',
                    email: 'john@example.com',
                    message: 'Hello there!',
                }),
            });
        });

        await waitFor(() => {
             expect(screen.getByText('Message Sent! ✓')).toBeDefined();
        });
    });

    it('handles API errors correctly', async () => {
        (global.fetch as Mock).mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Custom API Error' }),
        } as Response);

        render(<Contact />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there!' } });

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to Send')).toBeDefined();
            expect(screen.getByText('Custom API Error')).toBeDefined();
        });
    });

    it('handles network errors correctly', async () => {
        (global.fetch as Mock).mockRejectedValue(new Error('Network Error'));

        render(<Contact />);

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello there!' } });

        const submitButton = screen.getByRole('button', { name: /Send Message/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to Send')).toBeDefined();
            expect(screen.getByText('Network error. Please try again.')).toBeDefined();
        });
    });
});
