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
  duplicateComponent: (id: string) => string

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
  setPanOffset: (offset: { x: number; y: number }) => void
  resetCanvas: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void

  // History actions
  undo: () => void
  redo: () => void
  saveHistory: (description: string) => void
  clearHistory: () => void
  canUndo: boolean
  canRedo: boolean

  // Utility
  panOffset: { x: number; y: number }
  getComponent: (id: string) => ComponentNode | undefined
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
  zoom: 100,
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
        canUndo: false,
        canRedo: false,
        panOffset: { x: 0, y: 0 },

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
        addComponent: (component, parentId) => {
          const id = generateComponentId(component.type)
          const newComponent: ComponentNode = {
            ...component,
            id,
            children: component.children || [],
            styles: component.styles || {},
            functions: component.functions || [],
          }

          set((state) => ({
            components: {
              ...state.components,
              [id]: newComponent,
            },
          }))

          return id
        },

        updateComponent: (id, updates) => {
          set((state) => {
            const component = state.components[id]
            if (!component) return state

            return {
              components: {
                ...state.components,
                [id]: { ...component, ...updates },
              },
            }
          })
        },

        deleteComponent: (id) => {
          set((state) => {
            const newComponents = { ...state.components }
            delete newComponents[id]

            return {
              components: newComponents,
              selectedComponentIds: state.selectedComponentIds.filter((cid) => cid !== id),
            }
          })
        },

        duplicateComponent: (id) => {
          const component = get().components[id]
          if (!component) return ''

          const newId = generateComponentId(component.type)
          const duplicate = deepClone(component)
          duplicate.id = newId

          set((state) => ({
            components: {
              ...state.components,
              [newId]: duplicate,
            },
          }))

          return newId
        },

        // Selection actions
        selectComponent: (id, multi = false) => {
          set((state) => {
            if (multi) {
              return {
                selectedComponentIds: [...state.selectedComponentIds, id],
              }
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
          // Implementation for moving components
          console.log('moveComponent', id, newParentId, index)
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
          const clampedZoom = Math.max(25, Math.min(400, zoom))
          set({ zoom: clampedZoom })
        },

        setPan: (x, y) => {
          set({ pan: { x, y }, panOffset: { x, y } })
        },

        setPanOffset: (offset) => {
          set({ panOffset: offset, pan: offset })
        },

        resetCanvas: () => {
          set({ zoom: 100, pan: { x: 0, y: 0 }, panOffset: { x: 0, y: 0 } })
        },

        zoomIn: () => {
          const currentZoom = get().zoom
          get().setZoom(currentZoom + 25)
        },

        zoomOut: () => {
          const currentZoom = get().zoom
          get().setZoom(currentZoom - 25)
        },

        resetZoom: () => {
          set({ zoom: 100 })
        },

        // History actions
        undo: () => {
          set((state) => {
            if (state.historyIndex <= 0) return state

            const newIndex = state.historyIndex - 1
            const historyState = state.history[newIndex]

            return {
              components: historyState.components,
              historyIndex: newIndex,
              canUndo: newIndex > 0,
              canRedo: true,
            }
          })
        },

        redo: () => {
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state

            const newIndex = state.historyIndex + 1
            const historyState = state.history[newIndex]

            return {
              components: historyState.components,
              historyIndex: newIndex,
              canUndo: true,
              canRedo: newIndex < state.history.length - 1,
            }
          })
        },

        saveHistory: (description) => {
          set((state) => {
            const newHistory: HistoryState = {
              components: deepClone(state.components),
              timestamp: Date.now(),
              description,
            }

            const history = state.history.slice(0, state.historyIndex + 1)
            history.push(newHistory)

            // Keep only last 100 states
            const trimmedHistory = history.slice(-100)

            return {
              history: trimmedHistory,
              historyIndex: trimmedHistory.length - 1,
              canUndo: trimmedHistory.length > 1,
              canRedo: false,
            }
          })
        },

        clearHistory: () => {
          set({ history: [], historyIndex: -1, canUndo: false, canRedo: false })
        },

        // Utility
        getComponent: (id) => {
          return get().components[id]
        },

        getAllComponents: () => {
          return Object.values(get().components)
        },

        getComponentTree: () => {
          const components = get().components
          return Object.values(components).filter((c) => !c.position)
        },
      }),
      {
        name: 'builder-store',
        partialize: (state) => ({
          showComponentLibrary: state.showComponentLibrary,
          showPropertiesPanel: state.showPropertiesPanel,
          showLayersPanel: state.showLayersPanel,
          showCodeEditor: state.showCodeEditor,
          zoom: state.zoom,
          pan: state.pan,
          previewDevice: state.previewDevice,
        }),
      }
    )
  )
)
