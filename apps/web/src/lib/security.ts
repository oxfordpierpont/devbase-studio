/**
 * Security Utilities
 * Input sanitization, XSS prevention, and security helpers
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''

  // Replace dangerous characters
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize user input for database storage
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')

  // Trim whitespace
  sanitized = sanitized.trim()

  // Limit length
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000)
  }

  return sanitized
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Validate slug format (URL-safe identifier)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false

  const slugRegex = /^[a-z0-9-]+$/
  return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) return false
  if (token.length !== expectedToken.length) return false

  // Constant-time comparison to prevent timing attacks
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i)
  }

  return result === 0
}

/**
 * Hash sensitive data (for comparison, not storage)
 */
export async function hashData(data: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    // Fallback for environments without Web Crypto API
    return btoa(data)
  }

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeInput(item)
          : typeof item === 'object'
          ? sanitizeObject(item)
          : item
      )
    } else {
      sanitized[key] = value
    }
  }

  return sanitized as T
}

/**
 * Check if string contains SQL injection attempts
 */
export function containsSqlInjection(input: string): boolean {
  if (!input) return false

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\/\*|\*\/|;|xp_|sp_)/i,
    /(\bOR\b.*=.*|1\s*=\s*1|\bAND\b.*=.*)/i,
    /(\bUNION\b.*\bSELECT\b)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Check if string contains XSS attempts
 */
export function containsXss(input: string): boolean {
  if (!input) return false

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ]

  return xssPatterns.some((pattern) => pattern.test(input))
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (!password) {
    return { isValid: false, score: 0, feedback: ['Password is required'] }
  }

  // Length check
  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push('Password should be at least 8 characters')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Add uppercase letters')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Add lowercase letters')
  }

  // Number check
  if (/\d/.test(password)) {
    score += 15
  } else {
    feedback.push('Add numbers')
  }

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 10
  } else {
    feedback.push('Add special characters')
  }

  const isValid = score >= 75 && password.length >= 8

  return { isValid, score, feedback }
}

/**
 * Secure compare two strings to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
