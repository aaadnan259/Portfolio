import { render, cleanup } from '@testing-library/react'
import { describe, it, vi, afterEach, expect } from 'vitest'
import ProjectCard from '../../src/components/ProjectCard'
import React from 'react'

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, initial, whileInView, viewport, transition, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
  },
}))

vi.mock('lucide-react', () => ({
  Github: () => <div>Github</div>,
  ExternalLink: () => <div>Link</div>,
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: any) => <a href={href} className={className}>{children}</a>,
}))

const baseProject = {
  title: 'Test Project',
  subtitle: 'Subtitle',
  description: 'Description',
  links: { demo: 'https://example.com', github: 'https://github.com' },
  image: '/test.jpg',
  tags: [],
}

function generateTags(count: number) {
  return Array.from({ length: count }, (_, i) => `Tag ${i}`)
}

describe('ProjectCard Performance Benchmark', () => {
  afterEach(cleanup)

  it('measures rerender performance with large tag list modification (prepend)', () => {
    const TAG_COUNT = 2000
    const ITERATIONS = 50
    const tags = generateTags(TAG_COUNT)
    const newTags = ['New Tag', ...tags]

    const projectInitial = { ...baseProject, tags: tags }
    const projectUpdated = { ...baseProject, tags: newTags }

    let totalTime = 0

    for (let i = 0; i < ITERATIONS; i++) {
      const { rerender } = render(<ProjectCard project={projectInitial} index={0} />)

      const start = performance.now()
      rerender(<ProjectCard project={projectUpdated} index={0} />)
      const end = performance.now()

      totalTime += (end - start)
      cleanup()
    }

    const averageTime = totalTime / ITERATIONS
    console.log(`BENCHMARK_RESULT: Average rerender time for prepend operation (${TAG_COUNT} tags): ${averageTime.toFixed(4)} ms`)

    expect(averageTime).toBeGreaterThan(0)
  }, 30000)
})
