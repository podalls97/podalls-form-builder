import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles Tailwind conflicts - later class wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm', 'text-lg')).toBe('text-lg')
  })

  it('filters out falsy values', () => {
    expect(cn('px-2', false, null, undefined, 'py-1')).toBe('px-2 py-1')
  })

  it('handles empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles arrays of class names', () => {
    expect(cn(['px-2', 'py-1'])).toBe('px-2 py-1')
  })

  it('handles conditional class names', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
  })

  it('handles complex Tailwind class combinations', () => {
    expect(cn('px-2 py-3', 'px-4')).toBe('py-3 px-4')
  })

  it('handles objects with conditional classes', () => {
    expect(cn({ 'px-2': true, 'py-1': false, 'text-sm': true })).toBe('px-2 text-sm')
  })

  it('combines multiple input types', () => {
    expect(cn('px-2', ['py-1', 'text-sm'], { 'font-bold': true })).toBe('px-2 py-1 text-sm font-bold')
  })

  it('handles nested arrays', () => {
    expect(cn('base', [['nested', 'classes'], 'more'])).toBe('base nested classes more')
  })
})
