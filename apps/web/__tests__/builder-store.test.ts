/**
 * Builder Store Tests
 * Tests for Zustand builder state management
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { useBuilderStore } from '@/store/builder'

describe('Builder Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useBuilderStore.getState()
    store.setProject(null)
    store.clearHistory()
  })

  describe('Component Management', () => {
    it('should add a new component', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: { text: 'Click me' },
        children: [],
      })

      expect(componentId).toBeDefined()
      const component = store.getComponent(componentId)
      expect(component).toBeDefined()
      expect(component?.type).toBe('Button')
      expect(component?.props.text).toBe('Click me')
    })

    it('should update a component', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: { text: 'Click me' },
        children: [],
      })

      store.updateComponent(componentId, {
        props: { text: 'Updated text' },
      })

      const component = store.getComponent(componentId)
      expect(component?.props.text).toBe('Updated text')
    })

    it('should delete a component', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: { text: 'Click me' },
        children: [],
      })

      store.deleteComponent(componentId)

      const component = store.getComponent(componentId)
      expect(component).toBeUndefined()
    })

    it('should duplicate a component', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: { text: 'Original' },
        children: [],
      })

      const duplicateId = store.duplicateComponent(componentId)

      expect(duplicateId).toBeDefined()
      expect(duplicateId).not.toBe(componentId)

      const original = store.getComponent(componentId)
      const duplicate = store.getComponent(duplicateId)

      expect(duplicate?.type).toBe(original?.type)
      expect(duplicate?.props).toEqual(original?.props)
    })

    it('should add nested components', () => {
      const store = useBuilderStore.getState()

      const containerId = store.addComponent({
        type: 'Container',
        props: {},
        children: [],
      })

      const buttonId = store.addComponent(
        {
          type: 'Button',
          props: { text: 'Child button' },
          children: [],
        },
        containerId
      )

      const container = store.getComponent(containerId)
      expect(container?.children).toHaveLength(1)
      expect(container?.children[0].id).toBe(buttonId)
    })
  })

  describe('Selection Management', () => {
    it('should select a component', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: {},
        children: [],
      })

      store.selectComponent(componentId)

      expect(store.selectedComponentIds).toContain(componentId)
    })

    it('should deselect all components', () => {
      const store = useBuilderStore.getState()

      const id1 = store.addComponent({ type: 'Button', props: {}, children: [] })
      const id2 = store.addComponent({ type: 'Text', props: {}, children: [] })

      store.selectComponent(id1)
      store.selectComponent(id2)

      expect(store.selectedComponentIds).toHaveLength(2)

      store.deselectAll()

      expect(store.selectedComponentIds).toHaveLength(0)
    })
  })

  describe('Undo/Redo', () => {
    it('should undo component addition', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: {},
        children: [],
      })

      store.saveHistory('Add button')

      expect(store.getComponent(componentId)).toBeDefined()

      store.undo()

      expect(store.getComponent(componentId)).toBeUndefined()
    })

    it('should redo component addition', () => {
      const store = useBuilderStore.getState()

      const componentId = store.addComponent({
        type: 'Button',
        props: {},
        children: [],
      })

      store.saveHistory('Add button')
      store.undo()

      expect(store.getComponent(componentId)).toBeUndefined()

      store.redo()

      expect(store.getComponent(componentId)).toBeDefined()
    })

    it('should track history correctly', () => {
      const store = useBuilderStore.getState()

      store.addComponent({ type: 'Button', props: {}, children: [] })
      store.saveHistory('Add button 1')

      store.addComponent({ type: 'Text', props: {}, children: [] })
      store.saveHistory('Add text')

      expect(store.canUndo).toBe(true)
      expect(store.canRedo).toBe(false)

      store.undo()

      expect(store.canUndo).toBe(true)
      expect(store.canRedo).toBe(true)
    })
  })

  describe('Canvas Controls', () => {
    it('should update zoom level', () => {
      const store = useBuilderStore.getState()

      store.setZoom(150)

      expect(store.zoom).toBe(150)
    })

    it('should clamp zoom level', () => {
      const store = useBuilderStore.getState()

      store.setZoom(500) // Above max
      expect(store.zoom).toBeLessThanOrEqual(400)

      store.setZoom(10) // Below min
      expect(store.zoom).toBeGreaterThanOrEqual(25)
    })

    it('should zoom in and out', () => {
      const store = useBuilderStore.getState()

      const initialZoom = store.zoom

      store.zoomIn()
      expect(store.zoom).toBeGreaterThan(initialZoom)

      store.zoomOut()
      expect(store.zoom).toBe(initialZoom)
    })

    it('should reset zoom', () => {
      const store = useBuilderStore.getState()

      store.setZoom(200)
      store.resetZoom()

      expect(store.zoom).toBe(100)
    })

    it('should update pan offset', () => {
      const store = useBuilderStore.getState()

      store.setPanOffset({ x: 100, y: 50 })

      expect(store.panOffset.x).toBe(100)
      expect(store.panOffset.y).toBe(50)
    })
  })
})
