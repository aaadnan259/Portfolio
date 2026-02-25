import { render, screen } from '@testing-library/react'
import { expect, test, vi, describe } from 'vitest'
import Skills from '../../src/components/Skills'

// Mock framer-motion since we don't need animations in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, initial, whileInView, viewport, transition, ...props }: any) => (
            <div className={className} {...props}>
                {children}
            </div>
        ),
    },
}))

// Define data inside the mock to avoid hoisting issues
vi.mock('@/data/portfolio', () => {
    // Mock simple React components for the icons
    const MockIconA = (props: any) => <svg data-testid="icon-a" {...props} />
    const MockIconB = (props: any) => <svg data-testid="icon-b" {...props} />
    const MockIconC = (props: any) => <svg data-testid="icon-c" {...props} />

    return {
        skills: [
            {
                category: "Test Category 1",
                items: [
                    { name: "Skill A", icon: MockIconA },
                    { name: "Skill B", icon: MockIconB }
                ]
            },
            {
                category: "Test Category 2",
                items: [
                    { name: "Skill C", icon: MockIconC }
                ]
            }
        ]
    }
})

describe('Skills Component', () => {
    test('renders the Skills section with correct title', () => {
        render(<Skills />);

        // Check for main heading
        const heading = screen.getByText('Technical Skills')
        expect(heading).toBeDefined()
    })

    test('renders all skill categories', () => {
        render(<Skills />)

        expect(screen.getByText('Test Category 1')).toBeDefined()
        expect(screen.getByText('Test Category 2')).toBeDefined()
    })

    test('renders all skill items', () => {
        render(<Skills />)

        expect(screen.getByText('Skill A')).toBeDefined()
        expect(screen.getByText('Skill B')).toBeDefined()
        expect(screen.getByText('Skill C')).toBeDefined()
    })

    test('renders correct structure based on data', () => {
        render(<Skills />)

        // Check for mocked SVGs by testid
        const iconA = screen.getByTestId('icon-a')
        const iconB = screen.getByTestId('icon-b')
        const iconC = screen.getByTestId('icon-c')

        expect(iconA).toBeDefined()
        expect(iconB).toBeDefined()
        expect(iconC).toBeDefined()
    })
})
