import { expect, test, vi, describe, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import ProjectCard from '../../src/components/ProjectCard'
import { ProjectItem } from '../../src/types'

// Mock dependencies
vi.mock('next/image', () => ({
    default: ({ fill, ...props }: any) => <img {...props} />
}))

vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>
    }
}))

// Mock IntersectionObserver
const observeMock = vi.fn()
const disconnectMock = vi.fn()

class IntersectionObserverMock {
    callback: IntersectionObserverCallback
    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback
    }
    observe = observeMock
    disconnect = disconnectMock
    unobserve = vi.fn()
    takeRecords = vi.fn()

    // Helper to simulate intersection
    trigger(isIntersecting: boolean) {
        this.callback([{ isIntersecting, target: {} as Element } as IntersectionObserverEntry], this as any)
    }
}

// Mock HTMLMediaElement methods
const playMock = vi.fn().mockImplementation(() => Promise.resolve())
const pauseMock = vi.fn()

beforeEach(() => {
    vi.clearAllMocks()
    // Setup mocks on prototype
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        writable: true,
        value: playMock
    })
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        writable: true,
        value: pauseMock
    })
})

afterEach(() => {
    cleanup()
})

const mockProject: ProjectItem = {
    title: 'Test Project',
    subtitle: 'A test subtitle',
    description: 'This is a test description for the project card.',
    tags: ['React', 'TypeScript', 'Testing'],
    links: {
        demo: 'https://demo.example.com',
        github: 'https://github.com/example/repo'
    },
    image: '/images/test-project.jpg',
    video: '/videos/test-video.mp4',
    imagePosition: 'left'
}

describe('ProjectCard Video Optimization', () => {
    test('video plays when intersecting and pauses when leaving', () => {
        // We need to capture the observer instance created by the component
        let observerInstance: IntersectionObserverMock | undefined;

        // Override the global IntersectionObserver
        const OriginalIntersectionObserver = global.IntersectionObserver;
        global.IntersectionObserver = class extends IntersectionObserverMock {
            constructor(callback: IntersectionObserverCallback) {
                super(callback)
                observerInstance = this
            }
        } as any

        render(<ProjectCard project={mockProject} index={0} />)

        // Verify observer was created (meaning useEffect ran and observed something)
        // Note: If the component doesn't use IntersectionObserver yet, this might fail or observerInstance will be undefined/unused
        // But for our test of the *optimization*, we expect it to be used.

        // In the pre-optimized code, this might pass if I don't assert observer usage immediately,
        // but since I want to verify the FIX, I will assert it.

        expect(observerInstance).toBeDefined()
        expect(observeMock).toHaveBeenCalled()

        // Simulate entering viewport
        observerInstance.trigger(true)
        expect(playMock).toHaveBeenCalled()

        // Simulate leaving viewport
        observerInstance.trigger(false)
        expect(pauseMock).toHaveBeenCalled()

        // Restore
        global.IntersectionObserver = OriginalIntersectionObserver
    })
})
