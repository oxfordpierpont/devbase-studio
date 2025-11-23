import { NextRequest, NextResponse } from 'next/server'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { z } from 'zod'

// Request validation schema
const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  definition: z.any().optional(),
  ui_kit: z.string().optional(),
})

/**
 * GET /api/projects/[id]
 * Get a specific project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Get project from database
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      metadata: {
        timestamp: new Date().toISOString(),
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
 * PUT /api/projects/[id]
 * Update a project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validationResult = updateProjectSchema.safeParse(body)

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

    const updates = validationResult.data

    // Verify ownership before update
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Update project
    const { data: project, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      metadata: {
        timestamp: new Date().toISOString(),
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
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Verify ownership before delete
    const { data: existing } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Delete project (cascade will handle related records)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: error.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id, name: existing.name },
      metadata: {
        timestamp: new Date().toISOString(),
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
