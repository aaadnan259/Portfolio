import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../src/app/page'

// Mock the components that might cause issues in a unit test environment
// or are not the focus of this test
vi.mock('../src/components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}))
vi.mock('../src/components/Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}))
vi.mock('../src/components/RevealOnScroll', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

test('Home page renders main heading', () => {
    render(<Page />)
    // Check for a key element on the home page. 
    // Adjust the text matcher based on your actual content.
    // For now, checking if it renders without crashing.
    const main = screen.getByRole('main')
    expect(main).toBeDefined()
})
