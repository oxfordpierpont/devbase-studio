/**
 * Visual Builder State Management
 * Uses Zustand for state management
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  Project,
  ComponentNode,
  BuilderState,
  HistoryState,
  DeviceType,
  ComponentType,
  StyleConfig,
} from '@devbase/types'
import { generateComponentId, deepClone } from '@/lib/utils'

interface BuilderStore extends BuilderState {
  // Project actions
  setProject: (project: Project | null) => void
  updateProject: (updates: Partial<Project>) => void

  // Component actions
  addComponent: (component: Omit<ComponentNode, 'id'>, parentId?: string) => string
  updateComponent: (id: string, updates: Partial<ComponentNode>) => void
  deleteComponent: (id: string) => void
  duplicateComponent: (id: string) => void

  // Selection actions
  selectComponent: (id: string, multi?: boolean) => void
  deselectAll: () => void
  selectMultiple: (ids: string[]) => void

  // Drag & Drop actions
  moveComponent: (id: string, newParentId: string | null, index: number) => void
  setHoveredComponent: (id: string | null) => void

  // Panel actions
  togglePanel: (panel: 'componentLibrary' | 'properties' | 'layers' | 'codeEditor') => void
  setPreviewMode: (mode: boolean) => void
  setPreviewDevice: (device: DeviceType) => void

  // Canvas actions
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetCanvas: () => void

  // History actions
  undo: () => void
  redo: () => void
  saveHistory: (description: string) => void
  clearHistory: () => void

  // Utility
  getComponent: (id: string) => ComponentNode | null
  getAllComponents: () => ComponentNode[]
  getComponentTree: () => ComponentNode[]
}

const initialState: BuilderState = {
  currentProject: null,
  selectedComponentIds: [],
  hoveredComponentId: null,
  components: {},
  showComponentLibrary: true,
  showPropertiesPanel: true,
  showLayersPanel: true,
  showCodeEditor: false,
  zoom: 1,
  pan: { x: 0, y: 0 },
  history: [],
  historyIndex: -1,
  previewMode: false,
  previewDevice: 'desktop',
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Project actions
        setProject: (project) => {
          set({
            currentProject: project,
            components: {},
            selectedComponentIds: [],
            history: [],
            historyIndex: -1,
          })
        },

        updateProject: (updates) => {
          set((state) => ({
            currentProject: state.currentProject
              ? { ...state.currentProject, ...updates }
              : null,
          }))
        },

        // Component actions
        addComponent: (componentData, parentId) => {
          const id = generateComponentId(componentData.type)

          const newComponent: ComponentNode = {
            id,
            ...componentData,
          }

          set((state) => {
            const components = { ...state.components }
            components[id] = newComponent

            // If parent exists, add to its children
            if (parentId && components[parentId]) {
              components[parentId] = {
                ...components[parentId],
                children: [...components[parentId].children, newComponent],
              }
            }

            return { components }
          })

          get().saveHistory(`Added ${componentData.type} component`)
          return id
        },

        updateComponent: (id, updates) => {
          set((state) => {
            const components = { ...state.components }
            if (components[id]) {
              components[id] = { ...components[id], ...updates }
            }
            return { components }
          })

          get().saveHistory(`Updated component ${id}`)
        },

        deleteComponent: (id) => {
          set((state) => {
            const components = { ...state.components }

            // Recursively delete children
            const deleteRecursive = (compId: string) => {
              const component = components[compId]
              if (!component) return

              component.children.forEach((child) => {
                deleteRecursive(child.id)
              })

              delete components[compId]
            }

            deleteRecursive(id)

            // Remove from parent's children
            Object.values(components).forEach((comp) => {
              comp.children = comp.children.filter((child) => child.id !== id)
            })

            return {
              components,
              selectedComponentIds: state.selectedComponentIds.filter(
                (selectedId) => selectedId !== id
              ),
            }
          })

          get().saveHistory(`Deleted component ${id}`)
        },

        duplicateComponent: (id) => {
          const component = get().components[id]
          if (!component) return

          const clone = deepClone(component)
          const newId = generateComponentId(component.type)
          clone.id = newId

          set((state) => ({
            components: {
              ...state.components,
              [newId]: clone,
            },
          }))

          get().saveHistory(`Duplicated component ${id}`)
        },

        // Selection actions
        selectComponent: (id, multi = false) => {
          set((state) => {
            if (multi) {
              const ids = state.selectedComponentIds.includes(id)
                ? state.selectedComponentIds.filter((selectedId) => selectedId !== id)
                : [...state.selectedComponentIds, id]
              return { selectedComponentIds: ids }
            }
            return { selectedComponentIds: [id] }
          })
        },

        deselectAll: () => {
          set({ selectedComponentIds: [] })
        },

        selectMultiple: (ids) => {
          set({ selectedComponentIds: ids })
        },

        // Drag & Drop actions
        moveComponent: (id, newParentId, index) => {
          set((state) => {
            const components = { ...state.components }
            const component = components[id]
            if (!component) return state

            // Remove from old parent
            Object.values(components).forEach((comp) => {
              comp.children = comp.children.filter((child) => child.id !== id)
            })

            // Add to new parent
            if (newParentId && components[newParentId]) {
              const newParent = components[newParentId]
              newParent.children.splice(index, 0, component)
            }

            return { components }
          })

          get().saveHistory(`Moved component ${id}`)
        },

        setHoveredComponent: (id) => {
          set({ hoveredComponentId: id })
        },

        // Panel actions
        togglePanel: (panel) => {
          set((state) => {
            switch (panel) {
              case 'componentLibrary':
                return { showComponentLibrary: !state.showComponentLibrary }
              case 'properties':
                return { showPropertiesPanel: !state.showPropertiesPanel }
              case 'layers':
                return { showLayersPanel: !state.showLayersPanel }
              case 'codeEditor':
                return { showCodeEditor: !state.showCodeEditor }
              default:
                return state
            }
          })
        },

        setPreviewMode: (mode) => {
          set({ previewMode: mode })
        },

        setPreviewDevice: (device) => {
          set({ previewDevice: device })
        },

        // Canvas actions
        setZoom: (zoom) => {
          set({ zoom: Math.max(0.25, Math.min(4, zoom)) })
        },

        setPan: (x, y) => {
          set({ pan: { x, y } })
        },

        resetCanvas: () => {
          set({ zoom: 1, pan: { x: 0, y: 0 } })
        },

        // History actions
        saveHistory: (description) => {
          set((state) => {
            const historyState: HistoryState = {
              components: deepClone(state.components),
              timestamp: Date.now(),
              description,
            }

            const newHistory = [
              ...state.history.slice(0, state.historyIndex + 1),
              historyState,
            ]

            // Limit history to 100 items
            if (newHistory.length > 100) {
              newHistory.shift()
              return {
                history: newHistory,
                historyIndex: newHistory.length - 1,
              }
            }

            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            }
          })
        },

        undo: () => {
          set((state) => {
            if (state.historyIndex <= 0) return state

            const newIndex = state.historyIndex - 1
            const historyState = state.history[newIndex]

            return {
              components: deepClone(historyState.components),
              historyIndex: newIndex,
            }
          })
        },

        redo: () => {
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state

            const newIndex = state.historyIndex + 1
            const historyState = state.history[newIndex]

            return {
              components: deepClone(historyState.components),
              historyIndex: newIndex,
            }
          })
        },

        clearHistory: () => {
          set({ history: [], historyIndex: -1 })
        },

        // Utility
        getComponent: (id) => {
          return get().components[id] || null
        },

        getAllComponents: () => {
          return Object.values(get().components)
        },

        getComponentTree: () => {
          const components = get().components
          const roots: ComponentNode[] = []

          // Find root components (those without parents)
          Object.values(components).forEach((component) => {
            const isChild = Object.values(components).some((comp) =>
              comp.children.some((child) => child.id === component.id)
            )

            if (!isChild) {
              roots.push(component)
            }
          })

          return roots
        },
      }),
      {
        name: 'devbase-builder-storage',
        partialize: (state) => ({
          showComponentLibrary: state.showComponentLibrary,
          showPropertiesPanel: state.showPropertiesPanel,
          showLayersPanel: state.showLayersPanel,
          showCodeEditor: state.showCodeEditor,
          zoom: state.zoom,
          previewDevice: state.previewDevice,
        }),
      }
    )
  )
)
