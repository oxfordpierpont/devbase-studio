'use client'

/**
 * FunctionLibrary - Browse and attach functions to components
 */

import React, { useState } from 'react'
import { FUNCTION_DEFINITIONS, getFunctionCategories } from '@/lib/functions/definitions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Code, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunctionLibraryProps {
  onAttachFunction?: (functionId: string) => void
}

export function FunctionLibrary({ onAttachFunction }: FunctionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = getFunctionCategories()

  const filteredFunctions = FUNCTION_DEFINITIONS.filter((fn) => {
    const matchesSearch =
      searchQuery === '' ||
      fn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fn.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || fn.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleAttachFunction = (functionId: string) => {
    if (onAttachFunction) {
      onAttachFunction(functionId)
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Functions
        </h2>
        <p className="text-sm text-muted-foreground">
          {FUNCTION_DEFINITIONS.length} available functions
        </p>
      </div>

      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="border-b px-4">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="navigation" className="text-xs">
              Nav
            </TabsTrigger>
            <TabsTrigger value="data" className="text-xs">
              Data
            </TabsTrigger>
            <TabsTrigger value="storage" className="text-xs">
              Storage
            </TabsTrigger>
            <TabsTrigger value="ui" className="text-xs">
              UI
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Functions List */}
          <div className="space-y-3">
            {filteredFunctions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No functions found</p>
              </div>
            ) : (
              filteredFunctions.map((fn) => (
                <Card
                  key={fn.id}
                  className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Code className="h-3.5 w-3.5" />
                          {fn.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {fn.description}
                        </CardDescription>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {fn.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {/* Parameters */}
                      {fn.parameters && fn.parameters.length > 0 && (
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground mb-1">Parameters:</p>
                          <ul className="space-y-1">
                            {fn.parameters.slice(0, 2).map((param) => (
                              <li key={param.name} className="flex items-start gap-1">
                                <span className="font-mono text-primary">{param.name}</span>
                                <span className="text-muted-foreground">
                                  ({param.type}
                                  {param.required ? ', required' : ''})
                                </span>
                              </li>
                            ))}
                            {fn.parameters.length > 2 && (
                              <li className="text-muted-foreground">
                                +{fn.parameters.length - 2} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Attach Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => handleAttachFunction(fn.id)}
                      >
                        <Zap className="mr-2 h-3 w-3" />
                        Attach Function
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </Tabs>
    </div>
  )
}
