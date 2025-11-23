'use client'

/**
 * ComponentLibrary - Panel showing draggable components
 */

import React, { useState } from 'react'
import { useDrag } from 'react-dnd'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { COMPONENT_DEFINITIONS, getCategories, getComponentsByCategory } from '@/lib/components/definitions'
import { ComponentDefinition, ComponentCategory } from '@devbase/types'
import { cn } from '@/lib/utils'

function DraggableComponent({ definition }: { definition: ComponentDefinition }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: {
      type: definition.type,
      defaultProps: definition.defaultProps,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-move hover:border-primary hover:bg-accent transition-colors',
        isDragging && 'opacity-50'
      )}
    >
      <div className="text-2xl">{getIcon(definition.type)}</div>
      <div className="text-center">
        <p className="text-sm font-medium">{definition.name}</p>
        <p className="text-xs text-muted-foreground">{definition.description}</p>
      </div>
    </div>
  )
}

function getIcon(type: string): string {
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

export function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all')

  const categories = getCategories()
  const filteredComponents = COMPONENT_DEFINITIONS.filter((def) => {
    const matchesSearch = def.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      def.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || def.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-sm text-muted-foreground">Drag to canvas</p>
      </div>

      {/* Search */}
      <div className="p-4">
        <Input
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b px-4 pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'rounded-md px-3 py-1 text-sm transition-colors',
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-md px-3 py-1 text-sm capitalize transition-colors whitespace-nowrap',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredComponents.map((def) => (
            <DraggableComponent key={def.type} definition={def} />
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-sm">No components found</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          {filteredComponents.length} components available
        </p>
      </div>
    </div>
  )
}
