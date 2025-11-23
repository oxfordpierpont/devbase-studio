import { NextRequest, NextResponse } from 'next/server'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

// Request validation schema
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  uiKit: z.string().default('modern-minimalist'),
})

/**
 * GET /api/projects
 * List all projects for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Get projects from database
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: projects || [],
      metadata: {
        timestamp: new Date().toISOString(),
        count: projects?.length || 0,
      },
    })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createProjectSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      )
    }

    const { name, description, uiKit } = validationResult.data

    // Generate unique slug
    let slug = generateSlug(name)
    let slugAttempt = 0
    let uniqueSlug = slug

    // Check if slug exists and make it unique
    while (slugAttempt < 10) {
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', uniqueSlug)
        .single()

      if (!existing) break

      slugAttempt++
      uniqueSlug = `${slug}-${slugAttempt}`
    }

    // Create default project definition
    const defaultDefinition = {
      metadata: {
        id: '',
        name,
        description: description || '',
        version: '0.1.0',
      },
      settings: {
        uiKit,
        modules: [],
        theme: {
          colors: {
            primary: '#3b82f6',
            secondary: '#64748b',
            accent: '#8b5cf6',
            background: '#ffffff',
            foreground: '#0f172a',
          },
          fonts: {
            sans: 'Inter, sans-serif',
            mono: 'JetBrains Mono, monospace',
          },
          radius: 0.5,
        },
      },
      screens: [
        {
          id: 'home',
          name: 'Home',
          path: '/',
          components: [],
          metadata: {
            title: name,
            description: description || '',
          },
        },
      ],
      globalState: {},
    }

    // Insert project into database
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        description,
        slug: uniqueSlug,
        definition: defaultDefinition,
        ui_kit: uiKit,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: project,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error.message } },
      { status: 500 }
    )
  }
}
