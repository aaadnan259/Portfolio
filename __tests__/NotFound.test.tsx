import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import NotFound from '../src/app/not-found'

test('NotFound page renders correctly', () => {
    const { container } = render(<NotFound />)
    expect(container).toMatchSnapshot()
})
