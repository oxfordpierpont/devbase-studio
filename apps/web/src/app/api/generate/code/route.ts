import { NextRequest, NextResponse } from 'next/server'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { generateNextJSCode } from '@/../../generators/nextjs'
import { z } from 'zod'

// Request validation schema
const generateCodeSchema = z.object({
  projectId: z.string().min(1),
  framework: z.enum(['nextjs', 'react', 'vue']).default('nextjs'),
})

/**
 * POST /api/generate/code
 * Generate production code from project definition
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
    const validationResult = generateCodeSchema.safeParse(body)

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

    const { projectId, framework } = validationResult.data

    // Get project from database
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      )
    }

    // Validate project definition
    if (!project.definition || !project.definition.metadata) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_PROJECT', message: 'Project definition is invalid' },
        },
        { status: 400 }
      )
    }

    // Generate code based on framework
    let generatedCode
    try {
      switch (framework) {
        case 'nextjs':
          generatedCode = await generateNextJSCode(project.definition)
          break
        case 'react':
          return NextResponse.json(
            { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'React generator coming soon' } },
            { status: 501 }
          )
        case 'vue':
          return NextResponse.json(
            { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Vue generator coming soon' } },
            { status: 501 }
          )
        default:
          return NextResponse.json(
            { success: false, error: { code: 'INVALID_FRAMEWORK', message: 'Unsupported framework' } },
            { status: 400 }
          )
      }
    } catch (generationError: any) {
      console.error('Code generation error:', generationError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GENERATION_ERROR',
            message: 'Failed to generate code',
            details: generationError.message,
          },
        },
        { status: 500 }
      )
    }

    // Return generated code
    return NextResponse.json({
      success: true,
      data: {
        framework,
        code: generatedCode,
        projectId,
        projectName: project.name,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        fileCount: Object.keys(generatedCode.web?.files || {}).length,
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
