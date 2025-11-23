'use client'

/**
 * LayersPanel - Component tree view with hierarchy
 */

import React, { useState } from 'react'
import { useBuilderStore } from '@/store/builder'
import { ComponentNode } from '@devbase/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
} from 'lucide-react'

interface LayerItemProps {
  component: ComponentNode
  level: number
  isSelected: boolean
  onSelect: () => void
}

function LayerItem({ component, level, isSelected, onSelect }: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const {
    updateComponent,
    deleteComponent,
    duplicateComponent,
  } = useBuilderStore()

  const hasChildren = component.children && component.children.length > 0
  const isVisible = component.visible !== false
  const isLocked = component.locked || false

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateComponent(component.id, { visible: !isVisible })
  }

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateComponent(component.id, { locked: !isLocked })
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    duplicateComponent(component.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Delete ${component.type}?`)) {
      deleteComponent(component.id)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 px-2 py-1.5 hover:bg-accent cursor-pointer rounded transition-colors',
          isSelected && 'bg-primary/10 hover:bg-primary/20',
          !isVisible && 'opacity-50'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/Collapse */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="p-0.5 hover:bg-background rounded"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* Component Icon */}
        <span className="text-sm">{getComponentIcon(component.type)}</span>

        {/* Component Name */}
        <span className="flex-1 text-sm font-medium truncate">
          {component.type}
        </span>

        {/* Actions (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleToggleVisibility}
            className="p-0.5 hover:bg-background rounded"
            title={isVisible ? 'Hide' : 'Show'}
          >
            {isVisible ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={handleToggleLock}
            className="p-0.5 hover:bg-background rounded"
            title={isLocked ? 'Unlock' : 'Lock'}
          >
            {isLocked ? (
              <Lock className="h-3.5 w-3.5" />
            ) : (
              <Unlock className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={handleDuplicate}
            className="p-0.5 hover:bg-background rounded"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleDelete}
            className="p-0.5 hover:bg-background rounded text-destructive"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {component.children.map((child) => (
            <LayerItemWrapper key={child.id} componentId={child.id} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Wrapper to get component from store
function LayerItemWrapper({ componentId, level }: { componentId: string; level: number }) {
  const { getComponent, selectedComponentIds, selectComponent } = useBuilderStore()
  const component = getComponent(componentId)

  if (!component) return null

  return (
    <LayerItem
      component={component}
      level={level}
      isSelected={selectedComponentIds.includes(componentId)}
      onSelect={() => selectComponent(componentId)}
    />
  )
}

function getComponentIcon(type: string): string {
  const icons: Record<string, string> = {
    Button: '🔘',
    Text: '📝',
    Heading: '📰',
    Link: '🔗',
    Image: '🖼️',
    Divider: '➖',
    Container: '📦',
    Card: '🃏',
    Grid: '#️⃣',
    Flex: '↔️',
    Input: '✏️',
    Textarea: '📄',
    Select: '📋',
    Checkbox: '☑️',
    Alert: '⚠️',
  }
  return icons[type] || '❓'
}

export function LayersPanel() {
  const { getComponentTree, deselectAll } = useBuilderStore()
  const componentTree = getComponentTree()

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Layers</h2>
        <p className="text-sm text-muted-foreground">Component hierarchy</p>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {componentTree.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-muted-foreground">
            <p className="text-sm">No components yet</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {componentTree.map((component) => (
              <LayerItemWrapper
                key={component.id}
                componentId={component.id}
                level={0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Button variant="outline" size="sm" className="w-full" onClick={deselectAll}>
          Deselect All
        </Button>
      </div>
    </div>
  )
}
