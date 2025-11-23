'use client'

/**
 * Builder Page - Main visual builder interface
 */

import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useBuilderStore } from '@/store/builder'
import { Toolbar } from '@/components/builder/Toolbar'
import { ComponentLibrary } from '@/components/builder/ComponentLibrary'
import { Canvas } from '@/components/builder/Canvas'
import { PropertiesPanel } from '@/components/builder/PropertiesPanel'

export default function BuilderPage() {
  const {
    showComponentLibrary,
    showPropertiesPanel,
  } = useBuilderStore()

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col">
        {/* Toolbar */}
        <Toolbar />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Component Library Panel */}
          {showComponentLibrary && (
            <div className="w-80 border-r">
              <ComponentLibrary />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1">
            <Canvas />
          </div>

          {/* Properties Panel */}
          {showPropertiesPanel && (
            <div className="w-80 border-l">
              <PropertiesPanel />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  )
}
