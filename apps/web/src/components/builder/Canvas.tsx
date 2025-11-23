'use client'

/**
 * Canvas - Main visual builder canvas
 * Supports zoom, pan, drag & drop, and component rendering
 */

import React, { useRef, useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import { useBuilderStore } from '@/store/builder'
import { ComponentNode } from '@devbase/types'
import { cn } from '@/lib/utils'
import { ComponentRenderer } from './ComponentRenderer'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    components,
    selectedComponentIds,
    zoom,
    pan,
    setZoom,
    setPan,
    addComponent,
    selectComponent,
    deselectAll,
  } = useBuilderStore()

  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  // Drop zone for new components
  const [{ isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { type: string; defaultProps: any }, monitor) => {
      const offset = monitor.getClientOffset()
      if (!offset || !canvasRef.current) return

      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = (offset.x - canvasRect.left - pan.x) / zoom
      const y = (offset.y - canvasRect.top - pan.y) / zoom

      addComponent(
        {
          type: item.type as any,
          props: item.defaultProps,
          styles: {},
          children: [],
          functions: [],
          position: { x, y },
        },
        undefined
      )
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.25, Math.min(4, zoom * delta))
      setZoom(newZoom)
    }
  }

  // Pan with middle mouse or space + drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    } else if (e.button === 0 && e.target === canvasRef.current) {
      // Click on canvas background - deselect all
      deselectAll()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan(e.clientX - panStart.x, e.clientY - panStart.y)
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Get root components (those without parents)
  const rootComponents = Object.values(components).filter(
    (component) =>
      !Object.values(components).some((c) =>
        c.children.some((child) => child.id === component.id)
      )
  )

  return (
    <div
      ref={(node) => {
        drop(node)
        // @ts-ignore
        canvasRef.current = node
      }}
      className={cn(
        'relative h-full w-full overflow-hidden bg-gray-50',
        isOver && 'ring-2 ring-primary ring-inset',
        isPanning && 'cursor-grabbing'
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Components Container */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {rootComponents.map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            isSelected={selectedComponentIds.includes(component.id)}
            onSelect={() => selectComponent(component.id)}
          />
        ))}
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-4 right-4 rounded-md bg-background px-3 py-1 text-sm shadow-md">
        {Math.round(zoom * 100)}%
      </div>

      {/* Empty State */}
      {rootComponents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Drag components here to start building</p>
            <p className="text-sm">Use the component library on the left</p>
          </div>
        </div>
      )}
    </div>
  )
}
