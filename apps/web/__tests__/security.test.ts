/**
 * Security Tests
 * Tests for input sanitization and security utilities
 */

import { describe, it, expect } from '@jest/globals'
import {
  sanitizeHtml,
  sanitizeInput,
  sanitizeUrl,
  isValidEmail,
  isValidSlug,
  containsSqlInjection,
  containsXss,
  validatePasswordStrength,
  secureCompare,
} from '@/lib/security'

describe('Security Utilities', () => {
  describe('HTML Sanitization', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>'
      const sanitized = sanitizeHtml(input)

      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('&lt;script&gt;')
    })

    it('should escape quotes', () => {
      const input = `He said "Hello" and 'Goodbye'`
      const sanitized = sanitizeHtml(input)

      expect(sanitized).toContain('&quot;')
      expect(sanitized).toContain('&#x27;')
    })

    it('should handle empty input', () => {
      expect(sanitizeHtml('')).toBe('')
      expect(sanitizeHtml(null as any)).toBe('')
    })
  })

  describe('Input Sanitization', () => {
    it('should remove null bytes', () => {
      const input = 'test\0string'
      const sanitized = sanitizeInput(input)

      expect(sanitized).not.toContain('\0')
      expect(sanitized).toBe('teststring')
    })

    it('should trim whitespace', () => {
      const input = '  test string  '
      const sanitized = sanitizeInput(input)

      expect(sanitized).toBe('test string')
    })

    it('should limit length', () => {
      const input = 'a'.repeat(20000)
      const sanitized = sanitizeInput(input)

      expect(sanitized.length).toBeLessThanOrEqual(10000)
    })
  })

  describe('URL Sanitization', () => {
    it('should allow valid HTTP URLs', () => {
      const url = 'http://example.com'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('should allow valid HTTPS URLs', () => {
      const url = 'https://example.com'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('should reject javascript: URLs', () => {
      const url = 'javascript:alert(1)'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBeNull()
    })

    it('should reject data: URLs', () => {
      const url = 'data:text/html,<script>alert(1)</script>'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBeNull()
    })

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('not a url')).toBeNull()
      expect(sanitizeUrl('')).toBeNull()
    })
  })

  describe('Email Validation', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@example.co.uk')).toBe(true)
    })

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('should reject emails over 255 characters', () => {
      const longEmail = 'a'.repeat(250) + '@example.com'
      expect(isValidEmail(longEmail)).toBe(false)
    })
  })

  describe('Slug Validation', () => {
    it('should validate correct slugs', () => {
      expect(isValidSlug('my-project')).toBe(true)
      expect(isValidSlug('project-123')).toBe(true)
      expect(isValidSlug('abc')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(isValidSlug('My Project')).toBe(false) // Spaces
      expect(isValidSlug('project_name')).toBe(false) // Underscore
      expect(isValidSlug('UPPERCASE')).toBe(false) // Uppercase
      expect(isValidSlug('ab')).toBe(false) // Too short
      expect(isValidSlug('')).toBe(false)
    })

    it('should reject slugs over 100 characters', () => {
      const longSlug = 'a'.repeat(101)
      expect(isValidSlug(longSlug)).toBe(false)
    })
  })

  describe('SQL Injection Detection', () => {
    it('should detect SQL keywords', () => {
      expect(containsSqlInjection('SELECT * FROM users')).toBe(true)
      expect(containsSqlInjection('DROP TABLE users')).toBe(true)
      expect(containsSqlInjection("1' OR '1'='1")).toBe(true)
    })

    it('should detect SQL comments', () => {
      expect(containsSqlInjection('test-- comment')).toBe(true)
      expect(containsSqlInjection('test/* comment */')).toBe(true)
    })

    it('should allow safe input', () => {
      expect(containsSqlInjection('My Project Name')).toBe(false)
      expect(containsSqlInjection('user@example.com')).toBe(false)
    })
  })

  describe('XSS Detection', () => {
    it('should detect script tags', () => {
      expect(containsXss('<script>alert(1)</script>')).toBe(true)
      expect(containsXss('<SCRIPT>alert(1)</SCRIPT>')).toBe(true)
    })

    it('should detect javascript: protocol', () => {
      expect(containsXss('javascript:alert(1)')).toBe(true)
      expect(containsXss('JAVASCRIPT:alert(1)')).toBe(true)
    })

    it('should detect event handlers', () => {
      expect(containsXss('<img onerror=alert(1)>')).toBe(true)
      expect(containsXss('<div onclick="evil()">')).toBe(true)
    })

    it('should detect dangerous tags', () => {
      expect(containsXss('<iframe src="evil.com"></iframe>')).toBe(true)
      expect(containsXss('<object data="evil.swf"></object>')).toBe(true)
    })

    it('should allow safe input', () => {
      expect(containsXss('Hello World')).toBe(false)
      expect(containsXss('<p>Safe paragraph</p>')).toBe(false)
    })
  })

  describe('Password Strength Validation', () => {
    it('should accept strong passwords', () => {
      const result = validatePasswordStrength('MyP@ssw0rd123')

      expect(result.isValid).toBe(true)
      expect(result.score).toBeGreaterThanOrEqual(75)
    })

    it('should reject weak passwords', () => {
      const result = validatePasswordStrength('weak')

      expect(result.isValid).toBe(false)
      expect(result.feedback.length).toBeGreaterThan(0)
    })

    it('should reject short passwords', () => {
      const result = validatePasswordStrength('Abc123!')

      expect(result.isValid).toBe(false)
      expect(result.feedback).toContain('Password should be at least 8 characters')
    })

    it('should provide feedback', () => {
      const result = validatePasswordStrength('password')

      expect(result.feedback).toContain('Add uppercase letters')
      expect(result.feedback).toContain('Add numbers')
      expect(result.feedback).toContain('Add special characters')
    })
  })

  describe('Secure Comparison', () => {
    it('should match identical strings', () => {
      expect(secureCompare('secret123', 'secret123')).toBe(true)
    })

    it('should reject different strings', () => {
      expect(secureCompare('secret123', 'secret456')).toBe(false)
    })

    it('should reject strings of different lengths', () => {
      expect(secureCompare('short', 'longer string')).toBe(false)
    })

    it('should handle empty strings', () => {
      expect(secureCompare('', '')).toBe(false)
      expect(secureCompare('test', '')).toBe(false)
    })
  })
})
