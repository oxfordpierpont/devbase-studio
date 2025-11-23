/**
 * Rate Limiting Utility
 * Prevents API abuse with in-memory rate limiting
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

// Default configurations for different endpoints
export const RATE_LIMITS = {
  default: { interval: 60000, maxRequests: 60 }, // 60 requests per minute
  auth: { interval: 300000, maxRequests: 5 }, // 5 requests per 5 minutes
  create: { interval: 60000, maxRequests: 10 }, // 10 creates per minute
  update: { interval: 60000, maxRequests: 30 }, // 30 updates per minute
  deploy: { interval: 300000, maxRequests: 3 }, // 3 deployments per 5 minutes
}

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.default
): {
  success: boolean
  limit: number
  remaining: number
  reset: number
} {
  const now = Date.now()
  const key = `${identifier}-${config.interval}`

  // Get or create entry
  let entry = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries()
  }

  // Check if entry exists and is still valid
  if (entry && entry.resetAt > now) {
    // Entry is valid, increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      return {
        success: false,
        limit: config.maxRequests,
        remaining: 0,
        reset: entry.resetAt,
      }
    }

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - entry.count,
      reset: entry.resetAt,
    }
  }

  // Create new entry
  entry = {
    count: 1,
    resetAt: now + config.interval,
  }
  rateLimitStore.set(key, entry)

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - 1,
    reset: entry.resetAt,
  }
}

/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key)
    }
  }
}

/**
 * Get identifier from request (IP address or user ID)
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) return userId

  // Try to get IP from headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a generic identifier
  return 'unknown'
}

/**
 * Rate limit middleware for API routes
 */
export async function rateLimitMiddleware(
  request: Request,
  userId?: string,
  config: RateLimitConfig = RATE_LIMITS.default
): Promise<Response | null> {
  const identifier = getIdentifier(request, userId)
  const result = checkRateLimit(identifier, config)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          limit: result.limit,
          reset: new Date(result.reset).toISOString(),
        },
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null
}

// Schedule periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 300000) // Clean up every 5 minutes
}
