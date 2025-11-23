'use client'

/**
 * ComponentRenderer - Renders visual representation of components on canvas
 */

import React from 'react'
import { ComponentNode } from '@devbase/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ComponentRendererProps {
  component: ComponentNode
  isSelected: boolean
  onSelect: () => void
}

export function ComponentRenderer({ component, isSelected, onSelect }: ComponentRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const baseClasses = cn(
    'relative transition-all',
    isSelected && 'ring-2 ring-primary ring-offset-2'
  )

  const position = component.position || { x: 0, y: 0 }
  const positionStyle = {
    position: 'absolute' as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: position.width ? `${position.width}px` : 'auto',
    height: position.height ? `${position.height}px` : 'auto',
  }

  // Render different component types
  const renderComponent = () => {
    switch (component.type) {
      case 'Button':
        return (
          <Button
            variant={component.props.variant || 'default'}
            size={component.props.size || 'default'}
            onClick={handleClick}
          >
            {component.props.text || 'Button'}
          </Button>
        )

      case 'Text':
        const TextTag = component.props.as || 'p'
        return (
          <TextTag onClick={handleClick} className="cursor-pointer">
            {component.props.content || 'Text content'}
          </TextTag>
        )

      case 'Heading':
        const HeadingTag = component.props.level || 'h2'
        return (
          <HeadingTag onClick={handleClick} className="cursor-pointer font-bold">
            {component.props.content || 'Heading'}
          </HeadingTag>
        )

      case 'Link':
        return (
          <a
            href={component.props.href || '#'}
            target={component.props.target || '_self'}
            onClick={(e) => {
              e.preventDefault()
              handleClick(e)
            }}
            className="text-primary underline cursor-pointer"
          >
            {component.props.text || 'Link'}
          </a>
        )

      case 'Image':
        return (
          <img
            src={component.props.src || 'https://via.placeholder.com/400x300'}
            alt={component.props.alt || 'Image'}
            width={component.props.width || '400'}
            height={component.props.height || '300'}
            onClick={handleClick}
            className="cursor-pointer"
          />
        )

      case 'Divider':
        return (
          <hr
            onClick={handleClick}
            className="border-t border-gray-300 cursor-pointer"
          />
        )

      case 'Container':
        return (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-gray-300 p-4 min-h-[100px] cursor-pointer"
            style={{
              maxWidth: component.props.maxWidth || '1200px',
              padding: component.props.padding || '16px',
            }}
          >
            {component.children.length === 0 ? (
              <p className="text-gray-400 text-sm">Drop components here</p>
            ) : (
              component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))
            )}
          </div>
        )

      case 'Card':
        return (
          <Card onClick={handleClick} className="cursor-pointer w-[350px]">
            <CardHeader>
              <CardTitle>{component.props.title || 'Card Title'}</CardTitle>
              {component.props.description && (
                <CardDescription>{component.props.description}</CardDescription>
              )}
            </CardHeader>
            {component.children.length > 0 && (
              <CardContent>
                {component.children.map((child) => (
                  <ComponentRenderer
                    key={child.id}
                    component={child}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </CardContent>
            )}
          </Card>
        )

      case 'Grid':
        return (
          <div
            onClick={handleClick}
            className="grid cursor-pointer border-2 border-dashed border-gray-300 p-4 min-h-[200px]"
            style={{
              gridTemplateColumns: `repeat(${component.props.columns || 3}, 1fr)`,
              gap: component.props.gap || '16px',
            }}
          >
            {component.children.length === 0 ? (
              <p className="text-gray-400 text-sm col-span-full">Drop components in grid cells</p>
            ) : (
              component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))
            )}
          </div>
        )

      case 'Flex':
        return (
          <div
            onClick={handleClick}
            className="flex cursor-pointer border-2 border-dashed border-gray-300 p-4 min-h-[100px]"
            style={{
              flexDirection: component.props.direction || 'row',
              justifyContent: component.props.justify || 'start',
              alignItems: component.props.align || 'start',
              gap: component.props.gap || '16px',
            }}
          >
            {component.children.length === 0 ? (
              <p className="text-gray-400 text-sm">Drop components here</p>
            ) : (
              component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isSelected={false}
                  onSelect={() => {}}
                />
              ))
            )}
          </div>
        )

      case 'Input':
        return (
          <div onClick={handleClick} className="cursor-pointer w-full max-w-sm">
            {component.props.label && <Label>{component.props.label}</Label>}
            <Input
              type={component.props.type || 'text'}
              placeholder={component.props.placeholder || 'Enter text...'}
              name={component.props.name}
              disabled
            />
          </div>
        )

      case 'Textarea':
        return (
          <div onClick={handleClick} className="cursor-pointer w-full max-w-sm">
            {component.props.label && <Label>{component.props.label}</Label>}
            <Textarea
              placeholder={component.props.placeholder || 'Enter text...'}
              name={component.props.name}
              rows={component.props.rows || 4}
              disabled
            />
          </div>
        )

      case 'Select':
        return (
          <div onClick={handleClick} className="cursor-pointer w-full max-w-sm">
            {component.props.label && <Label>{component.props.label}</Label>}
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              name={component.props.name}
              disabled
            >
              {component.props.options?.map((opt: any, i: number) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )

      case 'Checkbox':
        return (
          <div onClick={handleClick} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name={component.props.name}
              checked={component.props.checked}
              disabled
              className="h-4 w-4"
            />
            {component.props.label && <Label>{component.props.label}</Label>}
          </div>
        )

      case 'Alert':
        return (
          <div
            onClick={handleClick}
            className={cn(
              'relative w-full rounded-lg border p-4 cursor-pointer',
              component.props.variant === 'destructive'
                ? 'border-destructive/50 text-destructive'
                : 'border-gray-300'
            )}
          >
            {component.props.title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {component.props.title}
              </h5>
            )}
            {component.props.description && (
              <div className="text-sm opacity-90">{component.props.description}</div>
            )}
          </div>
        )

      default:
        return (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-red-300 p-4 cursor-pointer"
          >
            <p className="text-red-500">Unknown component: {component.type}</p>
          </div>
        )
    }
  }

  return (
    <div className={baseClasses} style={positionStyle}>
      {renderComponent()}
    </div>
  )
}
