/**
 * Devbase Studio - Core Type Definitions
 * Version: 1.0.0-alpha
 */

// ============================================================================
// DATABASE TYPES
// ============================================================================

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      components: {
        Row: ComponentDB
        Insert: Omit<ComponentDB, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ComponentDB, 'id' | 'created_at'>>
      }
      attached_functions: {
        Row: AttachedFunctionDB
        Insert: Omit<AttachedFunctionDB, 'id' | 'created_at'>
        Update: Partial<Omit<AttachedFunctionDB, 'id' | 'created_at'>>
      }
      installed_modules: {
        Row: InstalledModuleDB
        Insert: Omit<InstalledModuleDB, 'id' | 'installed_at'>
        Update: Partial<Omit<InstalledModuleDB, 'id' | 'installed_at'>>
      }
      deployments: {
        Row: Deployment
        Insert: Omit<Deployment, 'id' | 'created_at'>
        Update: Partial<Omit<Deployment, 'id' | 'created_at'>>
      }
      user_settings: {
        Row: UserSettings
        Insert: Omit<UserSettings, 'updated_at'>
        Update: Partial<Omit<UserSettings, 'updated_at'>>
      }
    }
  }
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  slug: string
  definition: ProjectDefinition
  ui_kit: string
  vercel_project_id: string | null
  vercel_deployment_url: string | null
  last_deployed_at: string | null
  created_at: string
  updated_at: string
}

export interface ProjectDefinition {
  metadata: {
    id: string
    name: string
    description: string
    version: string
  }
  settings: {
    uiKit: string
    modules: string[]
    theme: ThemeConfig
  }
  screens: Screen[]
  globalState: Record<string, any>
}

export interface Screen {
  id: string
  name: string
  path: string
  components: ComponentNode[]
  metadata: {
    title?: string
    description?: string
  }
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

export interface ComponentDB {
  id: string
  project_id: string
  component_id: string
  type: ComponentType
  parent_id: string | null
  props: Record<string, any>
  styles: StyleConfig
  children: string[]
  position: Position
  order_index: number
  visible: boolean
  locked: boolean
  created_at: string
  updated_at: string
}

export interface ComponentNode {
  id: string
  type: ComponentType
  props: Record<string, any>
  styles: StyleConfig
  children: ComponentNode[]
  functions: AttachedFunction[]
  position?: Position
}

export type ComponentType =
  // Basic
  | 'Button'
  | 'Text'
  | 'Heading'
  | 'Link'
  | 'Image'
  | 'Icon'
  | 'Divider'
  // Layout
  | 'Container'
  | 'Card'
  | 'Grid'
  | 'Flex'
  | 'Stack'
  // Form
  | 'Form'
  | 'Input'
  | 'Textarea'
  | 'Select'
  | 'Checkbox'
  | 'Radio'
  | 'Switch'
  // Feedback
  | 'Alert'
  | 'Toast'
  | 'Modal'
  | 'Spinner'

export interface ComponentDefinition {
  type: ComponentType
  category: ComponentCategory
  name: string
  description: string
  icon: string
  defaultProps: Record<string, any>
  propSchema: PropSchema[]
  previewImage?: string
}

export type ComponentCategory =
  | 'basic'
  | 'layout'
  | 'form'
  | 'feedback'
  | 'data'

export interface PropSchema {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'image'
  label: string
  description?: string
  default?: any
  options?: Array<{ label: string; value: any }>
  validation?: {
    required?: boolean
    min?: number
    max?: number
    pattern?: string
  }
}

// ============================================================================
// STYLE TYPES
// ============================================================================

export interface StyleConfig {
  // Layout
  display?: 'block' | 'inline' | 'flex' | 'grid' | 'none'
  flexDirection?: 'row' | 'column'
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around'
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  gap?: number

  // Spacing
  padding?: string
  margin?: string

  // Size
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string

  // Typography
  fontSize?: string
  fontWeight?: string
  textAlign?: 'left' | 'center' | 'right'
  color?: string

  // Background
  backgroundColor?: string
  backgroundImage?: string

  // Border
  border?: string
  borderRadius?: string

  // Effects
  boxShadow?: string
  opacity?: number

  // Responsive
  responsive?: {
    sm?: Partial<StyleConfig>
    md?: Partial<StyleConfig>
    lg?: Partial<StyleConfig>
  }
}

export interface Position {
  x: number
  y: number
  width?: number
  height?: number
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    sans: string
    mono: string
  }
  radius: number
}

// ============================================================================
// FUNCTION TYPES
// ============================================================================

export interface AttachedFunctionDB {
  id: string
  project_id: string
  component_id: string
  function_id: string
  trigger: FunctionTrigger
  config: Record<string, any>
  on_success: Action[]
  on_failure: Action[]
  order_index: number
  created_at: string
}

export interface AttachedFunction {
  id: string
  functionId: string
  trigger: FunctionTrigger
  config: Record<string, any>
  onSuccess: Action[]
  onFailure: Action[]
}

export type FunctionTrigger =
  | 'onClick'
  | 'onSubmit'
  | 'onLoad'
  | 'onChange'
  | 'onHover'
  | 'onFocus'
  | 'onBlur'

export interface FunctionDefinition {
  id: string
  name: string
  description: string
  category: FunctionCategory
  version: string

  inputs: InputParameter[]
  outputs: OutputParameter[]
  config?: ConfigParameter[]

  implementation: string // Code as string for code generation

  tags?: string[]
  icon?: string
  complexity?: 'low' | 'medium' | 'high'
}

export type FunctionCategory =
  | 'navigation'
  | 'data'
  | 'ui'
  | 'storage'
  | 'validation'
  | 'formatting'
  | 'api'

export interface InputParameter {
  name: string
  type: ParameterType
  description: string
  required: boolean
  default?: any
}

export interface OutputParameter {
  name: string
  type: ParameterType
  description: string
}

export interface ConfigParameter {
  name: string
  type: ParameterType
  label: string
  description: string
  default: any
  options?: Array<{ label: string; value: any }>
}

export type ParameterType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'

export interface Action {
  type: ActionType
  payload: Record<string, any>
}

export type ActionType =
  | 'navigate'
  | 'setState'
  | 'showAlert'
  | 'callFunction'
  | 'openModal'
  | 'closeModal'

// ============================================================================
// MODULE TYPES
// ============================================================================

export interface InstalledModuleDB {
  id: string
  project_id: string
  module_id: string
  version: string
  config: Record<string, any>
  enabled: boolean
  installed_at: string
}

export interface ModuleDefinition {
  id: string
  name: string
  description: string
  version: string
  author: string

  dependencies: {
    modules?: string[]
    packages?: Record<string, string>
    functions?: string[]
  }

  components: ComponentDefinition[]
  functions: FunctionDefinition[]
  database?: {
    schema: string
    migrations: string[]
  }

  config: ConfigParameter[]
  readme: string
  examples?: Example[]
}

export interface Example {
  title: string
  description: string
  code: string
}

// ============================================================================
// DEPLOYMENT TYPES
// ============================================================================

export interface Deployment {
  id: string
  project_id: string
  platform: DeploymentPlatform
  type: DeploymentType
  status: DeploymentStatus
  deployment_url: string | null
  build_url: string | null
  generated_code: GeneratedCode | null
  error_message: string | null
  build_time_ms: number | null
  deployed_by: string | null
  started_at: string
  completed_at: string | null
  created_at: string
}

export type DeploymentPlatform = 'web' | 'ios' | 'android'
export type DeploymentType = 'full' | 'ota'
export type DeploymentStatus =
  | 'pending'
  | 'building'
  | 'deployed'
  | 'failed'

export interface GeneratedCode {
  web?: {
    files: Record<string, string>
    dependencies: Record<string, string>
  }
  mobile?: {
    files: Record<string, string>
    dependencies: Record<string, string>
  }
}

// ============================================================================
// CODE GENERATION TYPES
// ============================================================================

export interface CodeGenerationRequest {
  project: ProjectDefinition
  platform: 'web' | 'mobile'
  options?: {
    format?: boolean
    includeComments?: boolean
    typescript?: boolean
  }
}

export interface CodeGenerationResult {
  success: boolean
  files: Record<string, string>
  dependencies: Record<string, string>
  errors?: CodeGenerationError[]
}

export interface CodeGenerationError {
  code: string
  message: string
  component?: string
  line?: number
}

// ============================================================================
// USER SETTINGS TYPES
// ============================================================================

export interface UserSettings {
  user_id: string
  theme: 'light' | 'dark' | 'system'
  editor_preferences: EditorPreferences
  vercel_token_encrypted: string | null
  vercel_team_id: string | null
  updated_at: string
}

export interface EditorPreferences {
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  showRulers: boolean
  autoSave: boolean
  autoSaveInterval: number // seconds
}

// ============================================================================
// BUILDER STATE TYPES
// ============================================================================

export interface BuilderState {
  // Project
  currentProject: Project | null

  // Canvas
  selectedComponentIds: string[]
  hoveredComponentId: string | null
  components: Record<string, ComponentNode>

  // Panels
  showComponentLibrary: boolean
  showPropertiesPanel: boolean
  showLayersPanel: boolean
  showCodeEditor: boolean

  // Canvas state
  zoom: number
  pan: { x: number; y: number }

  // History
  history: HistoryState[]
  historyIndex: number

  // UI state
  previewMode: boolean
  previewDevice: DeviceType
}

export interface HistoryState {
  components: Record<string, ComponentNode>
  timestamp: number
  description: string
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

// ============================================================================
// API TYPES
// ============================================================================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  metadata?: {
    timestamp: string
    requestId: string
  }
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]
