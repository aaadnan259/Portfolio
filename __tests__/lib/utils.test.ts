import { expect, test, describe } from 'vitest'
import { cn, escapeHtml } from '../../src/lib/utils'

describe('cn utility', () => {
  test('merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })

  test('handles conditional classes', () => {
    expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2')
  })

  test('handles arrays of classes', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2')
  })

  test('handles mixed inputs', () => {
    // Note: clsx handles object arguments but cn(...inputs: ClassValue[]) uses twMerge(clsx(inputs))
    // clsx supports objects, so cn should too.
    expect(cn('class1', ['class2'], { class3: true, class4: false })).toBe('class1 class2 class3')
  })

  test('merges conflicting tailwind classes', () => {
    // twMerge should handle conflicts, taking the last one defined
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    // Ensure non-conflicting classes are kept
    expect(cn('p-4', 'm-2')).toBe('p-4 m-2')
  })
})

describe('escapeHtml utility', () => {
  test('escapes ampersand', () => {
    expect(escapeHtml('&')).toBe('&amp;')
  })

  test('escapes less than', () => {
    expect(escapeHtml('<')).toBe('&lt;')
  })

  test('escapes greater than', () => {
    expect(escapeHtml('>')).toBe('&gt;')
  })

  test('escapes double quote', () => {
    expect(escapeHtml('"')).toBe('&quot;')
  })

  test('escapes single quote', () => {
    expect(escapeHtml("'")).toBe('&#039;')
  })

  test('escapes multiple special characters', () => {
    // Corrected expectation string
    expect(escapeHtml('<div class="test">Wait & See</div>')).toBe('&lt;div class=&quot;test&quot;&gt;Wait &amp; See&lt;/div&gt;')
  })

  test('returns original string if no special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World')
  })

  test('handles empty string', () => {
    expect(escapeHtml('')).toBe('')
  })
})
