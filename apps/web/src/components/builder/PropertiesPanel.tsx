'use client'

/**
 * PropertiesPanel - Edit properties of selected component
 */

import React from 'react'
import { useBuilderStore } from '@/store/builder'
import { getComponentDefinition } from '@/lib/components/definitions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PropertiesPanel() {
  const { selectedComponentIds, getComponent, updateComponent, deleteComponent } = useBuilderStore()

  if (selectedComponentIds.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        <p>Select a component to edit its properties</p>
      </div>
    )
  }

  if (selectedComponentIds.length > 1) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        <p>{selectedComponentIds.length} components selected</p>
      </div>
    )
  }

  const component = getComponent(selectedComponentIds[0])
  if (!component) return null

  const definition = getComponentDefinition(component.type)
  if (!definition) return null

  const handlePropChange = (propName: string, value: any) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        [propName]: value,
      },
    })
  }

  const handleDelete = () => {
    deleteComponent(component.id)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">{definition.name}</h2>
        <p className="text-sm text-muted-foreground">{definition.description}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {definition.propSchema.map((schema) => (
          <div key={schema.name} className="space-y-2">
            <Label>{schema.label}</Label>
            {schema.description && (
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            )}

            {schema.type === 'string' && (
              <Input
                value={component.props[schema.name] || schema.default || ''}
                onChange={(e) => handlePropChange(schema.name, e.target.value)}
                placeholder={schema.default as string}
              />
            )}

            {schema.type === 'number' && (
              <Input
                type="number"
                value={component.props[schema.name] || schema.default || 0}
                onChange={(e) => handlePropChange(schema.name, parseFloat(e.target.value))}
                min={schema.validation?.min}
                max={schema.validation?.max}
              />
            )}

            {schema.type === 'select' && schema.options && (
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={component.props[schema.name] || schema.default}
                onChange={(e) => handlePropChange(schema.name, e.target.value)}
              >
                {schema.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {schema.type === 'boolean' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={component.props[schema.name] || schema.default || false}
                  onChange={(e) => handlePropChange(schema.name, e.target.checked)}
                  className="h-4 w-4"
                />
                <Label>Enabled</Label>
              </div>
            )}

            {schema.type === 'color' && (
              <Input
                type="color"
                value={component.props[schema.name] || schema.default || '#000000'}
                onChange={(e) => handlePropChange(schema.name, e.target.value)}
              />
            )}

            {schema.type === 'image' && (
              <div className="space-y-2">
                <Input
                  value={component.props[schema.name] || schema.default || ''}
                  onChange={(e) => handlePropChange(schema.name, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {component.props[schema.name] && (
                  <img
                    src={component.props[schema.name]}
                    alt="Preview"
                    className="max-w-full h-auto rounded border"
                    style={{ maxHeight: '150px' }}
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Styles Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Styling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                placeholder="auto, 100%, 400px"
                value={component.styles?.width || ''}
                onChange={(e) =>
                  updateComponent(component.id, {
                    styles: { ...(component.styles || {}), width: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Height</Label>
              <Input
                placeholder="auto, 100%, 400px"
                value={component.styles?.height || ''}
                onChange={(e) =>
                  updateComponent(component.id, {
                    styles: { ...(component.styles || {}), height: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={component.styles?.backgroundColor || '#ffffff'}
                onChange={(e) =>
                  updateComponent(component.id, {
                    styles: { ...(component.styles || {}), backgroundColor: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Padding</Label>
              <Input
                placeholder="0, 16px, 1rem"
                value={component.styles?.padding || ''}
                onChange={(e) =>
                  updateComponent(component.id, {
                    styles: { ...(component.styles || {}), padding: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Margin</Label>
              <Input
                placeholder="0, 16px, 1rem"
                value={component.styles?.margin || ''}
                onChange={(e) =>
                  updateComponent(component.id, {
                    styles: { ...(component.styles || {}), margin: e.target.value },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="border-t p-4 space-y-2">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDelete}
        >
          Delete Component
        </Button>
      </div>
    </div>
  )
}
