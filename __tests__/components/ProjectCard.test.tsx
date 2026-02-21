import { expect, test, vi, describe } from 'vitest'
import { render, screen } from '@testing-library/react'
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

// Define test data
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
    imagePosition: 'left'
}

describe('ProjectCard Component', () => {
    test('renders project details correctly', () => {
        render(<ProjectCard project={mockProject} index={0} />)

        expect(screen.getByText('Test Project')).toBeDefined()
        expect(screen.getByText('A test subtitle')).toBeDefined()
        expect(screen.getByText('This is a test description for the project card.')).toBeDefined()
    })

    test('renders tags', () => {
        render(<ProjectCard project={mockProject} index={0} />)

        mockProject.tags.forEach(tag => {
            expect(screen.getByText(tag)).toBeDefined()
        })
    })

    test('renders github and demo links when provided', () => {
        render(<ProjectCard project={mockProject} index={0} />)

        const githubLink = screen.getByLabelText('View Source Code')
        expect(githubLink.getAttribute('href')).toBe(mockProject.links.github)

        const demoLink = screen.getByLabelText('View Live Demo')
        expect(demoLink.getAttribute('href')).toBe(mockProject.links.demo)
    })

    test('renders video when video prop is present', () => {
        const videoProject: ProjectItem = {
            ...mockProject,
            video: '/videos/test-video.mp4',
            image: undefined
        }

        const { container } = render(<ProjectCard project={videoProject} index={0} />)

        // Check for video tag
        const videoElement = container.querySelector('video')
        expect(videoElement).not.toBeNull()
        expect(videoElement?.querySelector('source')?.getAttribute('src')).toBe('/videos/test-video.mp4')
    })

    test('renders image when video is missing', () => {
        render(<ProjectCard project={mockProject} index={0} />)

        const img = screen.getByAltText('Test Project')
        expect(img).toBeDefined()
        expect(img.getAttribute('src')).toBe('/images/test-project.jpg')
    })

    test('renders placeholder image when image is missing', () => {
        const noImageProject: ProjectItem = {
            ...mockProject,
            image: undefined,
            video: undefined
        }

        render(<ProjectCard project={noImageProject} index={0} />)

        const img = screen.getByAltText('Test Project')
        expect(img).toBeDefined()
        expect(img.getAttribute('src')).toBe('/images/placeholder.jpg')
    })

    test('does not render github/demo link when missing', () => {
         const noLinksProject: ProjectItem = {
            ...mockProject,
            links: {
                demo: '',
                github: ''
            }
        }

        render(<ProjectCard project={noLinksProject} index={0} />)

        const links = screen.queryAllByRole('link')
        expect(links.length).toBe(0)
    })
})
