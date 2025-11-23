-- Devbase Studio Database Schema
-- Version: 1.0.0-alpha
-- This schema supports the visual builder, projects, and code generation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PROJECTS
-- ============================================================================

-- Projects table - Each user can have multiple projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,

  -- Project configuration
  definition JSONB NOT NULL DEFAULT '{}'::jsonb, -- The full project JSON
  ui_kit VARCHAR(50) DEFAULT 'modern-minimalist',

  -- Deployment info
  vercel_project_id VARCHAR(100),
  vercel_deployment_url TEXT,
  last_deployed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Indexes
  CONSTRAINT projects_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ============================================================================
-- COMPONENTS
-- ============================================================================

-- Component definitions table
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,

  -- Component identity
  component_id VARCHAR(100) NOT NULL, -- Unique within project
  type VARCHAR(50) NOT NULL, -- Button, Text, Container, etc.
  parent_id VARCHAR(100), -- For nesting

  -- Component data
  props JSONB DEFAULT '{}'::jsonb,
  styles JSONB DEFAULT '{}'::jsonb,
  children JSONB DEFAULT '[]'::jsonb,

  -- Layout
  position JSONB DEFAULT '{}'::jsonb, -- { x, y, width, height }
  order_index INTEGER DEFAULT 0,

  -- State
  visible BOOLEAN DEFAULT true,
  locked BOOLEAN DEFAULT false,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, component_id)
);

CREATE INDEX idx_components_project_id ON components(project_id);
CREATE INDEX idx_components_type ON components(type);
CREATE INDEX idx_components_parent_id ON components(parent_id);

-- ============================================================================
-- FUNCTIONS (Attached to components)
-- ============================================================================

CREATE TABLE attached_functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  component_id VARCHAR(100) NOT NULL,

  -- Function details
  function_id VARCHAR(100) NOT NULL, -- Reference to function library
  trigger VARCHAR(50) NOT NULL, -- onClick, onSubmit, onLoad, etc.
  config JSONB DEFAULT '{}'::jsonb,

  -- Actions
  on_success JSONB DEFAULT '[]'::jsonb, -- Array of actions
  on_failure JSONB DEFAULT '[]'::jsonb,

  -- Order
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attached_functions_project_id ON attached_functions(project_id);
CREATE INDEX idx_attached_functions_component_id ON attached_functions(component_id);

-- ============================================================================
-- MODULES
-- ============================================================================

CREATE TABLE installed_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,

  -- Module details
  module_id VARCHAR(100) NOT NULL, -- e.g., 'blog', 'social-network'
  version VARCHAR(20) NOT NULL,

  -- Configuration
  config JSONB DEFAULT '{}'::jsonb,

  -- State
  enabled BOOLEAN DEFAULT true,

  installed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(project_id, module_id)
);

CREATE INDEX idx_installed_modules_project_id ON installed_modules(project_id);

-- ============================================================================
-- DEPLOYMENTS
-- ============================================================================

CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,

  -- Deployment details
  platform VARCHAR(20) NOT NULL, -- 'web', 'ios', 'android'
  type VARCHAR(20) NOT NULL, -- 'full', 'ota'
  status VARCHAR(20) DEFAULT 'pending', -- pending, building, deployed, failed

  -- URLs
  deployment_url TEXT,
  build_url TEXT,

  -- Generated code snapshot
  generated_code JSONB, -- Store the generated code

  -- Metadata
  error_message TEXT,
  build_time_ms INTEGER,
  deployed_by UUID REFERENCES auth.users(id),

  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deployments_project_id ON deployments(project_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_created_at ON deployments(created_at DESC);

-- ============================================================================
-- USER SETTINGS
-- ============================================================================

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Preferences
  theme VARCHAR(20) DEFAULT 'light', -- light, dark, system
  editor_preferences JSONB DEFAULT '{}'::jsonb,

  -- Vercel integration
  vercel_token_encrypted TEXT, -- Encrypted token
  vercel_team_id VARCHAR(100),

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE attached_functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE installed_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only access their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Components: Access through project ownership
CREATE POLICY "Users can view components of their projects"
  ON components FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = components.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create components in their projects"
  ON components FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = components.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update components in their projects"
  ON components FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = components.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete components from their projects"
  ON components FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = components.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can manage functions in their projects"
  ON attached_functions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = attached_functions.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage modules in their projects"
  ON installed_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = installed_modules.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view deployments of their projects"
  ON deployments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create deployments for their projects"
  ON deployments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = deployments.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- User settings: Users can only access their own settings
CREATE POLICY "Users can manage their own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON components
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA (Development only)
-- ============================================================================

-- This will be populated by separate seed script
