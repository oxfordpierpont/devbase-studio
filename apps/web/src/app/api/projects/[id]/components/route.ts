import { NextRequest, NextResponse } from 'next/server'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { z } from 'zod'
import { ComponentNode } from '@devbase/types'

// Request validation schemas
const createComponentSchema = z.object({
  type: z.string().min(1),
  props: z.record(z.any()).default({}),
  children: z.array(z.any()).default([]),
  parentId: z.string().optional(),
})

const updateComponentSchema = z.object({
  componentId: z.string().min(1),
  updates: z.object({
    type: z.string().optional(),
    props: z.record(z.any()).optional(),
    children: z.array(z.any()).optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
  }),
})

const deleteComponentSchema = z.object({
  componentId: z.string().min(1),
})

/**
 * POST /api/projects/[id]/components
 * Add a component to the project
 */
export async function POST(
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
    const validationResult = createComponentSchema.safeParse(body)

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

    const { type, props, children, parentId } = validationResult.data

    // Get current project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Create new component
    const newComponent: ComponentNode = {
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      props,
      children,
      visible: true,
      locked: false,
    }

    // Update project definition
    const definition = project.definition as any
    const homeScreen = definition.screens?.[0]

    if (!homeScreen) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STATE', message: 'No home screen found' } },
        { status: 400 }
      )
    }

    // Add component to appropriate location
    if (parentId) {
      // Find parent and add as child
      const addToParent = (components: ComponentNode[]): boolean => {
        for (const comp of components) {
          if (comp.id === parentId) {
            if (!comp.children) comp.children = []
            comp.children.push(newComponent)
            return true
          }
          if (comp.children && addToParent(comp.children)) {
            return true
          }
        }
        return false
      }

      if (!addToParent(homeScreen.components)) {
        return NextResponse.json(
          { success: false, error: { code: 'NOT_FOUND', message: 'Parent component not found' } },
          { status: 404 }
        )
      }
    } else {
      // Add to root level
      homeScreen.components.push(newComponent)
    }

    // Save updated definition
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        definition,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: updateError.message } },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: newComponent,
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

/**
 * PUT /api/projects/[id]/components
 * Update a component in the project
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
    const validationResult = updateComponentSchema.safeParse(body)

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

    const { componentId, updates } = validationResult.data

    // Get current project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Update component in definition
    const definition = project.definition as any
    const homeScreen = definition.screens?.[0]

    if (!homeScreen) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STATE', message: 'No home screen found' } },
        { status: 400 }
      )
    }

    let componentFound = false

    const updateComponent = (components: ComponentNode[]): boolean => {
      for (const comp of components) {
        if (comp.id === componentId) {
          Object.assign(comp, updates)
          componentFound = true
          return true
        }
        if (comp.children && updateComponent(comp.children)) {
          return true
        }
      }
      return false
    }

    updateComponent(homeScreen.components)

    if (!componentFound) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Component not found' } },
        { status: 404 }
      )
    }

    // Save updated definition
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        definition,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: updateError.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { componentId, updates },
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
 * DELETE /api/projects/[id]/components
 * Delete a component from the project
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = deleteComponentSchema.safeParse(body)

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

    const { componentId } = validationResult.data

    // Get current project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Delete component from definition
    const definition = project.definition as any
    const homeScreen = definition.screens?.[0]

    if (!homeScreen) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STATE', message: 'No home screen found' } },
        { status: 400 }
      )
    }

    let componentFound = false

    const deleteComponent = (components: ComponentNode[], parent?: ComponentNode): boolean => {
      for (let i = 0; i < components.length; i++) {
        const comp = components[i]
        if (comp.id === componentId) {
          components.splice(i, 1)
          componentFound = true
          return true
        }
        if (comp.children && deleteComponent(comp.children, comp)) {
          return true
        }
      }
      return false
    }

    deleteComponent(homeScreen.components)

    if (!componentFound) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Component not found' } },
        { status: 404 }
      )
    }

    // Save updated definition
    const { data: updatedProject, error: updateError } = await supabase
      .from('projects')
      .update({
        definition,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database error:', updateError)
      return NextResponse.json(
        { success: false, error: { code: 'DATABASE_ERROR', message: updateError.message } },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { componentId },
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
