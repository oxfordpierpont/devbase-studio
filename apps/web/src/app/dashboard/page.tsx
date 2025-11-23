'use client'

/**
 * Dashboard Page - Project management
 */

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, getCurrentUser } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2, Plus, Folder, Calendar, Edit, Trash2 } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  slug: string
  created_at: string
  updated_at: string
  ui_kit: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    checkAuthAndLoadProjects()
  }, [])

  const checkAuthAndLoadProjects = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      await loadProjects()
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/login')
    }
  }

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects')
      const result = await response.json()

      if (result.success) {
        setProjects(result.data)
      } else {
        toast({
          title: 'Error loading projects',
          description: result.error?.message || 'Failed to load projects',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load projects',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a project name',
        variant: 'destructive',
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          uiKit: 'modern-minimalist',
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Project created',
          description: `${newProjectName} has been created successfully`,
        })
        setNewProjectName('')
        setNewProjectDescription('')
        setIsDialogOpen(false)
        await loadProjects()
      } else {
        toast({
          title: 'Error creating project',
          description: result.error?.message || 'Failed to create project',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Project deleted',
          description: `${projectName} has been deleted`,
        })
        await loadProjects()
      } else {
        toast({
          title: 'Error deleting project',
          description: result.error?.message || 'Failed to delete project',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      })
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Devbase Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">My Projects</h2>
            <p className="text-muted-foreground">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start building your application with a new project
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome App"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="A brief description of your project"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    disabled={isCreating}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Folder className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No projects yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first project to get started
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-1">{project.name}</span>
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(project.updated_at)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => router.push(`/builder/${project.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
