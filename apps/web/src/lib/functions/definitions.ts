/**
 * Function Library - Core Functions
 * Pre-built functions that can be attached to components
 */

import { FunctionDefinition } from '@devbase/types'

export const FUNCTION_DEFINITIONS: FunctionDefinition[] = [
  // Navigation Functions
  {
    id: 'navigate-to-page',
    name: 'Navigate to Page',
    category: 'navigation',
    description: 'Navigate to a different page in the application',
    parameters: [
      {
        name: 'path',
        type: 'string',
        required: true,
        description: 'The path to navigate to (e.g., "/about", "/contact")',
      },
      {
        name: 'replace',
        type: 'boolean',
        required: false,
        description: 'Replace current history entry instead of adding new one',
      },
    ],
    code: `
export async function navigateToPage(params: { path: string; replace?: boolean }) {
  const { path, replace = false } = params

  if (typeof window === 'undefined') return

  if (replace) {
    window.history.replaceState({}, '', path)
  } else {
    window.history.pushState({}, '', path)
  }

  // Trigger Next.js router navigation
  if (window.next?.router) {
    replace ? window.next.router.replace(path) : window.next.router.push(path)
  } else {
    window.location.href = path
  }
}
`,
  },

  {
    id: 'open-external-link',
    name: 'Open External Link',
    category: 'navigation',
    description: 'Open an external URL in a new tab or same window',
    parameters: [
      {
        name: 'url',
        type: 'string',
        required: true,
        description: 'The URL to open',
      },
      {
        name: 'newTab',
        type: 'boolean',
        required: false,
        description: 'Open in new tab (default: true)',
      },
    ],
    code: `
export async function openExternalLink(params: { url: string; newTab?: boolean }) {
  const { url, newTab = true } = params

  if (typeof window === 'undefined') return

  if (newTab) {
    window.open(url, '_blank', 'noopener,noreferrer')
  } else {
    window.location.href = url
  }
}
`,
  },

  // Data Functions
  {
    id: 'fetch-data',
    name: 'Fetch Data from API',
    category: 'data',
    description: 'Fetch data from an API endpoint',
    parameters: [
      {
        name: 'endpoint',
        type: 'string',
        required: true,
        description: 'API endpoint URL',
      },
      {
        name: 'method',
        type: 'string',
        required: false,
        description: 'HTTP method (GET, POST, PUT, DELETE)',
      },
      {
        name: 'body',
        type: 'any',
        required: false,
        description: 'Request body for POST/PUT requests',
      },
      {
        name: 'headers',
        type: 'any',
        required: false,
        description: 'Custom headers',
      },
    ],
    code: `
export async function fetchData(params: {
  endpoint: string
  method?: string
  body?: any
  headers?: Record<string, string>
}) {
  const { endpoint, method = 'GET', body, headers = {} } = params

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(endpoint, options)

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error: any) {
    console.error('Fetch error:', error)
    return { success: false, error: error.message }
  }
}
`,
  },

  {
    id: 'submit-form',
    name: 'Submit Form Data',
    category: 'data',
    description: 'Submit form data to an API endpoint',
    parameters: [
      {
        name: 'endpoint',
        type: 'string',
        required: true,
        description: 'API endpoint to submit to',
      },
      {
        name: 'formData',
        type: 'any',
        required: true,
        description: 'Form data object',
      },
      {
        name: 'onSuccess',
        type: 'string',
        required: false,
        description: 'Success callback function name',
      },
      {
        name: 'onError',
        type: 'string',
        required: false,
        description: 'Error callback function name',
      },
    ],
    code: `
export async function submitForm(params: {
  endpoint: string
  formData: any
  onSuccess?: string
  onError?: string
}) {
  const { endpoint, formData, onSuccess, onError } = params

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }

    const result = await response.json()

    if (onSuccess && typeof window[onSuccess] === 'function') {
      window[onSuccess](result)
    }

    return { success: true, data: result }
  } catch (error: any) {
    console.error('Form submission error:', error)

    if (onError && typeof window[onError] === 'function') {
      window[onError](error)
    }

    return { success: false, error: error.message }
  }
}
`,
  },

  // Storage Functions
  {
    id: 'save-to-local-storage',
    name: 'Save to Local Storage',
    category: 'storage',
    description: 'Save data to browser local storage',
    parameters: [
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'Storage key',
      },
      {
        name: 'value',
        type: 'any',
        required: true,
        description: 'Value to store',
      },
    ],
    code: `
export async function saveToLocalStorage(params: { key: string; value: any }) {
  const { key, value } = params

  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' }

  try {
    const serialized = JSON.stringify(value)
    window.localStorage.setItem(key, serialized)
    return { success: true }
  } catch (error: any) {
    console.error('Local storage save error:', error)
    return { success: false, error: error.message }
  }
}
`,
  },

  {
    id: 'load-from-local-storage',
    name: 'Load from Local Storage',
    category: 'storage',
    description: 'Load data from browser local storage',
    parameters: [
      {
        name: 'key',
        type: 'string',
        required: true,
        description: 'Storage key',
      },
      {
        name: 'defaultValue',
        type: 'any',
        required: false,
        description: 'Default value if key not found',
      },
    ],
    code: `
export async function loadFromLocalStorage(params: { key: string; defaultValue?: any }) {
  const { key, defaultValue = null } = params

  if (typeof window === 'undefined') return { success: false, error: 'Not in browser' }

  try {
    const serialized = window.localStorage.getItem(key)

    if (serialized === null) {
      return { success: true, data: defaultValue }
    }

    const data = JSON.parse(serialized)
    return { success: true, data }
  } catch (error: any) {
    console.error('Local storage load error:', error)
    return { success: false, error: error.message, data: defaultValue }
  }
}
`,
  },

  // UI Functions
  {
    id: 'show-toast',
    name: 'Show Toast Notification',
    category: 'ui',
    description: 'Display a toast notification message',
    parameters: [
      {
        name: 'title',
        type: 'string',
        required: true,
        description: 'Notification title',
      },
      {
        name: 'description',
        type: 'string',
        required: false,
        description: 'Notification description',
      },
      {
        name: 'variant',
        type: 'string',
        required: false,
        description: 'Variant: default, success, warning, destructive',
      },
      {
        name: 'duration',
        type: 'number',
        required: false,
        description: 'Duration in milliseconds (default: 5000)',
      },
    ],
    code: `
export async function showToast(params: {
  title: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  duration?: number
}) {
  const { title, description, variant = 'default', duration = 5000 } = params

  if (typeof window === 'undefined') return

  // Call toast function if available
  if (window.toast) {
    window.toast({ title, description, variant, duration })
  } else {
    // Fallback to console
    console.log('Toast:', { title, description, variant })
  }
}
`,
  },

  {
    id: 'toggle-visibility',
    name: 'Toggle Element Visibility',
    category: 'ui',
    description: 'Show or hide a component',
    parameters: [
      {
        name: 'componentId',
        type: 'string',
        required: true,
        description: 'ID of component to toggle',
      },
      {
        name: 'visible',
        type: 'boolean',
        required: false,
        description: 'Set specific visibility state',
      },
    ],
    code: `
export async function toggleVisibility(params: { componentId: string; visible?: boolean }) {
  const { componentId, visible } = params

  if (typeof window === 'undefined') return

  const element = document.getElementById(componentId)
  if (!element) {
    console.error('Element not found:', componentId)
    return { success: false, error: 'Element not found' }
  }

  if (visible !== undefined) {
    element.style.display = visible ? '' : 'none'
  } else {
    element.style.display = element.style.display === 'none' ? '' : 'none'
  }

  return { success: true }
}
`,
  },

  // Validation Functions
  {
    id: 'validate-email',
    name: 'Validate Email Address',
    category: 'validation',
    description: 'Validate an email address format',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email address to validate',
      },
    ],
    code: `
export async function validateEmail(params: { email: string }) {
  const { email } = params

  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  const isValid = emailRegex.test(email)

  return {
    success: true,
    isValid,
    message: isValid ? 'Valid email' : 'Invalid email format',
  }
}
`,
  },

  {
    id: 'validate-form-fields',
    name: 'Validate Form Fields',
    category: 'validation',
    description: 'Validate multiple form fields with rules',
    parameters: [
      {
        name: 'fields',
        type: 'any',
        required: true,
        description: 'Object with field names and values',
      },
      {
        name: 'rules',
        type: 'any',
        required: true,
        description: 'Validation rules for each field',
      },
    ],
    code: `
export async function validateFormFields(params: {
  fields: Record<string, any>
  rules: Record<string, { required?: boolean; minLength?: number; maxLength?: number; pattern?: string }>
}) {
  const { fields, rules } = params
  const errors: Record<string, string> = {}

  for (const [fieldName, fieldValue] of Object.entries(fields)) {
    const fieldRules = rules[fieldName]
    if (!fieldRules) continue

    // Required check
    if (fieldRules.required && (!fieldValue || fieldValue.toString().trim() === '')) {
      errors[fieldName] = 'This field is required'
      continue
    }

    if (!fieldValue) continue

    // Min length check
    if (fieldRules.minLength && fieldValue.toString().length < fieldRules.minLength) {
      errors[fieldName] = \`Minimum length is \${fieldRules.minLength}\`
      continue
    }

    // Max length check
    if (fieldRules.maxLength && fieldValue.toString().length > fieldRules.maxLength) {
      errors[fieldName] = \`Maximum length is \${fieldRules.maxLength}\`
      continue
    }

    // Pattern check
    if (fieldRules.pattern) {
      const regex = new RegExp(fieldRules.pattern)
      if (!regex.test(fieldValue.toString())) {
        errors[fieldName] = 'Invalid format'
      }
    }
  }

  const isValid = Object.keys(errors).length === 0

  return {
    success: true,
    isValid,
    errors: isValid ? null : errors,
  }
}
`,
  },
]

// Helper function to get function by ID
export function getFunctionById(id: string): FunctionDefinition | undefined {
  return FUNCTION_DEFINITIONS.find((fn) => fn.id === id)
}

// Helper function to get functions by category
export function getFunctionsByCategory(category: string): FunctionDefinition[] {
  return FUNCTION_DEFINITIONS.filter((fn) => fn.category === category)
}

// Get all categories
export function getFunctionCategories(): string[] {
  const categories = new Set(FUNCTION_DEFINITIONS.map((fn) => fn.category))
  return Array.from(categories)
}
