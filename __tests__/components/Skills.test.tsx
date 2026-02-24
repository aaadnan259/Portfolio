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
vi.mock('@/data/portfolio', () => ({
    skills: [
        {
            category: "Test Category 1",
            items: [
                { name: "Skill A", icon: "icon-a" },
                { name: "Skill B", icon: "icon-b" }
            ]
        },
        {
            category: "Test Category 2",
            items: [
                { name: "Skill C", icon: "icon-c" }
            ]
        }
    ]
}))

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
        const { container } = render(<Skills />)

        // Check for icons (they are rendered as <i> tags with class names)
        const iconA = container.querySelector('.icon-a')
        const iconB = container.querySelector('.icon-b')
        const iconC = container.querySelector('.icon-c')

        expect(iconA).not.toBeNull()
        expect(iconB).not.toBeNull()
        expect(iconC).not.toBeNull()
    })
})
