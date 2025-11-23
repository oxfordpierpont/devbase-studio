/**
 * Component Definitions Library
 * Defines all 15 MVP components with their properties, schemas, and defaults
 */

import { ComponentDefinition, ComponentCategory } from '@devbase/types'

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // ============================================================================
  // BASIC COMPONENTS
  // ============================================================================
  {
    type: 'Button',
    category: 'basic',
    name: 'Button',
    description: 'Clickable button element',
    icon: 'square',
    defaultProps: {
      text: 'Button',
      variant: 'default',
      size: 'default',
    },
    propSchema: [
      {
        name: 'text',
        type: 'string',
        label: 'Button Text',
        description: 'Text displayed on the button',
        default: 'Button',
        validation: { required: true },
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Button style variant',
        default: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Link', value: 'link' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        default: 'default',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Default', value: 'default' },
          { label: 'Large', value: 'lg' },
        ],
      },
    ],
  },

  {
    type: 'Text',
    category: 'basic',
    name: 'Text',
    description: 'Plain text element',
    icon: 'type',
    defaultProps: {
      content: 'Text content',
      as: 'p',
    },
    propSchema: [
      {
        name: 'content',
        type: 'string',
        label: 'Content',
        description: 'Text content',
        default: 'Text content',
        validation: { required: true },
      },
      {
        name: 'as',
        type: 'select',
        label: 'Element Type',
        default: 'p',
        options: [
          { label: 'Paragraph', value: 'p' },
          { label: 'Span', value: 'span' },
          { label: 'Div', value: 'div' },
        ],
      },
    ],
  },

  {
    type: 'Heading',
    category: 'basic',
    name: 'Heading',
    description: 'Heading text',
    icon: 'heading',
    defaultProps: {
      content: 'Heading',
      level: 'h2',
    },
    propSchema: [
      {
        name: 'content',
        type: 'string',
        label: 'Content',
        default: 'Heading',
        validation: { required: true },
      },
      {
        name: 'level',
        type: 'select',
        label: 'Level',
        default: 'h2',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' },
          { label: 'H5', value: 'h5' },
          { label: 'H6', value: 'h6' },
        ],
      },
    ],
  },

  {
    type: 'Link',
    category: 'basic',
    name: 'Link',
    description: 'Hyperlink element',
    icon: 'link',
    defaultProps: {
      text: 'Link',
      href: '#',
      target: '_self',
    },
    propSchema: [
      {
        name: 'text',
        type: 'string',
        label: 'Link Text',
        default: 'Link',
        validation: { required: true },
      },
      {
        name: 'href',
        type: 'string',
        label: 'URL',
        default: '#',
        validation: { required: true },
      },
      {
        name: 'target',
        type: 'select',
        label: 'Target',
        default: '_self',
        options: [
          { label: 'Same Window', value: '_self' },
          { label: 'New Window', value: '_blank' },
        ],
      },
    ],
  },

  {
    type: 'Image',
    category: 'basic',
    name: 'Image',
    description: 'Image element',
    icon: 'image',
    defaultProps: {
      src: 'https://via.placeholder.com/400x300',
      alt: 'Image',
      width: '400',
      height: '300',
    },
    propSchema: [
      {
        name: 'src',
        type: 'image',
        label: 'Image URL',
        default: 'https://via.placeholder.com/400x300',
        validation: { required: true },
      },
      {
        name: 'alt',
        type: 'string',
        label: 'Alt Text',
        default: 'Image',
        validation: { required: true },
      },
      {
        name: 'width',
        type: 'string',
        label: 'Width',
        default: '400',
      },
      {
        name: 'height',
        type: 'string',
        label: 'Height',
        default: '300',
      },
    ],
  },

  {
    type: 'Divider',
    category: 'basic',
    name: 'Divider',
    description: 'Horizontal divider line',
    icon: 'minus',
    defaultProps: {},
    propSchema: [],
  },

  // ============================================================================
  // LAYOUT COMPONENTS
  // ============================================================================
  {
    type: 'Container',
    category: 'layout',
    name: 'Container',
    description: 'Container for grouping elements',
    icon: 'box',
    defaultProps: {
      maxWidth: '1200px',
      padding: '16px',
    },
    propSchema: [
      {
        name: 'maxWidth',
        type: 'string',
        label: 'Max Width',
        default: '1200px',
      },
      {
        name: 'padding',
        type: 'string',
        label: 'Padding',
        default: '16px',
      },
    ],
  },

  {
    type: 'Card',
    category: 'layout',
    name: 'Card',
    description: 'Card container with shadow',
    icon: 'square',
    defaultProps: {
      title: 'Card Title',
      description: 'Card description',
    },
    propSchema: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Card Title',
      },
      {
        name: 'description',
        type: 'string',
        label: 'Description',
        default: 'Card description',
      },
    ],
  },

  {
    type: 'Grid',
    category: 'layout',
    name: 'Grid',
    description: 'Grid layout container',
    icon: 'grid',
    defaultProps: {
      columns: 3,
      gap: '16px',
    },
    propSchema: [
      {
        name: 'columns',
        type: 'number',
        label: 'Columns',
        default: 3,
        validation: { min: 1, max: 12 },
      },
      {
        name: 'gap',
        type: 'string',
        label: 'Gap',
        default: '16px',
      },
    ],
  },

  {
    type: 'Flex',
    category: 'layout',
    name: 'Flex',
    description: 'Flexbox layout container',
    icon: 'align-left',
    defaultProps: {
      direction: 'row',
      justify: 'start',
      align: 'start',
      gap: '16px',
    },
    propSchema: [
      {
        name: 'direction',
        type: 'select',
        label: 'Direction',
        default: 'row',
        options: [
          { label: 'Row', value: 'row' },
          { label: 'Column', value: 'column' },
        ],
      },
      {
        name: 'justify',
        type: 'select',
        label: 'Justify',
        default: 'start',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Between', value: 'between' },
          { label: 'Around', value: 'around' },
        ],
      },
      {
        name: 'align',
        type: 'select',
        label: 'Align',
        default: 'start',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'End', value: 'end' },
          { label: 'Stretch', value: 'stretch' },
        ],
      },
      {
        name: 'gap',
        type: 'string',
        label: 'Gap',
        default: '16px',
      },
    ],
  },

  // ============================================================================
  // FORM COMPONENTS
  // ============================================================================
  {
    type: 'Input',
    category: 'form',
    name: 'Input',
    description: 'Text input field',
    icon: 'text-cursor',
    defaultProps: {
      label: 'Label',
      placeholder: 'Enter text...',
      type: 'text',
      name: 'input',
    },
    propSchema: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Label',
      },
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
        default: 'Enter text...',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Type',
        default: 'text',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Password', value: 'password' },
          { label: 'Number', value: 'number' },
        ],
      },
      {
        name: 'name',
        type: 'string',
        label: 'Name',
        default: 'input',
        validation: { required: true },
      },
    ],
  },

  {
    type: 'Textarea',
    category: 'form',
    name: 'Textarea',
    description: 'Multi-line text input',
    icon: 'align-left',
    defaultProps: {
      label: 'Label',
      placeholder: 'Enter text...',
      name: 'textarea',
      rows: 4,
    },
    propSchema: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Label',
      },
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
        default: 'Enter text...',
      },
      {
        name: 'name',
        type: 'string',
        label: 'Name',
        default: 'textarea',
        validation: { required: true },
      },
      {
        name: 'rows',
        type: 'number',
        label: 'Rows',
        default: 4,
        validation: { min: 1, max: 20 },
      },
    ],
  },

  {
    type: 'Select',
    category: 'form',
    name: 'Select',
    description: 'Dropdown select',
    icon: 'chevron-down',
    defaultProps: {
      label: 'Label',
      name: 'select',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ],
    },
    propSchema: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Label',
      },
      {
        name: 'name',
        type: 'string',
        label: 'Name',
        default: 'select',
        validation: { required: true },
      },
    ],
  },

  {
    type: 'Checkbox',
    category: 'form',
    name: 'Checkbox',
    description: 'Checkbox input',
    icon: 'check-square',
    defaultProps: {
      label: 'Checkbox Label',
      name: 'checkbox',
      checked: false,
    },
    propSchema: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Checkbox Label',
      },
      {
        name: 'name',
        type: 'string',
        label: 'Name',
        default: 'checkbox',
        validation: { required: true },
      },
    ],
  },

  // ============================================================================
  // FEEDBACK COMPONENTS
  // ============================================================================
  {
    type: 'Alert',
    category: 'feedback',
    name: 'Alert',
    description: 'Alert message',
    icon: 'alert-circle',
    defaultProps: {
      variant: 'default',
      title: 'Alert Title',
      description: 'Alert description',
    },
    propSchema: [
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        default: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Destructive', value: 'destructive' },
        ],
      },
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Alert Title',
      },
      {
        name: 'description',
        type: 'string',
        label: 'Description',
        default: 'Alert description',
      },
    ],
  },
]

/**
 * Get component definition by type
 */
export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return COMPONENT_DEFINITIONS.find((def) => def.type === type)
}

/**
 * Get components by category
 */
export function getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
  return COMPONENT_DEFINITIONS.filter((def) => def.category === category)
}

/**
 * Get all categories
 */
export function getCategories(): ComponentCategory[] {
  return Array.from(new Set(COMPONENT_DEFINITIONS.map((def) => def.category)))
}
