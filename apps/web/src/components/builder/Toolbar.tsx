'use client'

/**
 * Toolbar - Main toolbar with actions (undo, redo, zoom, preview, publish)
 */

import React from 'react'
import { useBuilderStore } from '@/store/builder'
import { Button } from '@/components/ui/button'
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Code,
  Rocket,
  Save
} from 'lucide-react'

export function Toolbar() {
  const {
    zoom,
    setZoom,
    resetCanvas,
    undo,
    redo,
    history,
    historyIndex,
    previewMode,
    setPreviewMode,
    showCodeEditor,
    togglePanel,
  } = useBuilderStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className="flex items-center justify-between border-b bg-background px-4 py-2">
      {/* Left: Project Name */}
      <div>
        <h1 className="text-lg font-semibold">Devbase Studio</h1>
        <p className="text-xs text-muted-foreground">Visual Builder</p>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(zoom * 0.9)}
            disabled={zoom <= 0.25}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[60px] text-center text-sm">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom(zoom * 1.1)}
            disabled={zoom >= 4}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetCanvas}
            title="Reset View"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-2 h-6 w-px bg-border" />

        {/* Preview & Code */}
        <div className="flex items-center gap-1">
          <Button
            variant={previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant={showCodeEditor ? 'default' : 'ghost'}
            size="sm"
            onClick={() => togglePanel('codeEditor')}
          >
            <Code className="mr-2 h-4 w-4" />
            Code
          </Button>
        </div>
      </div>

      {/* Right: Save & Publish */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button size="sm">
          <Rocket className="mr-2 h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  )
}
