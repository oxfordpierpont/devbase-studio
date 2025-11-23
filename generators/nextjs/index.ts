/**
 * Next.js Code Generator
 * Generates production-ready Next.js code from project definition
 */

import { ProjectDefinition, ComponentNode, GeneratedCode } from '@devbase/types'

export async function generateNextJSCode(
  project: ProjectDefinition
): Promise<GeneratedCode> {
  const files: Record<string, string> = {}

  // Generate package.json
  files['package.json'] = JSON.stringify(
    {
      name: project.metadata.name.toLowerCase().replace(/\s+/g, '-'),
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        next: '14.0.4',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@supabase/supabase-js': '^2.39.0',
        tailwindcss: '^3.3.6',
        typescript: '^5.3.3',
      },
      devDependencies: {
        '@types/node': '^20',
        '@types/react': '^18',
        '@types/react-dom': '^18',
        autoprefixer: '^10',
        postcss: '^8',
      },
    },
    null,
    2
  )

  // Generate next.config.js
  files['next.config.js'] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
`

  // Generate tailwind.config.ts
  files['tailwind.config.ts'] = generateTailwindConfig(project)

  // Generate app/layout.tsx
  files['app/layout.tsx'] = generateRootLayout(project)

  // Generate app/page.tsx
  files['app/page.tsx'] = generateHomePage(project)

  // Generate components
  for (const screen of project.screens) {
    for (const component of screen.components) {
      const componentCode = generateComponent(component)
      files[`components/${component.id}.tsx`] = componentCode
    }
  }

  // Generate globals.css
  files['app/globals.css'] = generateGlobalCSS()

  return {
    web: {
      files,
      dependencies: {
        next: '14.0.4',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        tailwindcss: '^3.3.6',
      },
    },
  }
}

function generateTailwindConfig(project: ProjectDefinition): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(project.settings.theme.colors, null, 8)},
    },
  },
  plugins: [],
}
export default config
`
}

function generateRootLayout(project: ProjectDefinition): string {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${project.metadata.name}',
  description: '${project.metadata.description}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`
}

function generateHomePage(project: ProjectDefinition): string {
  const homeScreen = project.screens.find((s) => s.path === '/' || s.path === '')
  if (!homeScreen) {
    return `export default function HomePage() {
  return <div>Welcome to ${project.metadata.name}</div>
}
`
  }

  const componentImports = homeScreen.components
    .map((c) => `import ${c.id} from '@/components/${c.id}'`)
    .join('\n')

  const componentRenders = homeScreen.components
    .map((c) => `      <${c.id} />`)
    .join('\n')

  return `${componentImports}

export default function HomePage() {
  return (
    <div>
${componentRenders}
    </div>
  )
}
`
}

function generateComponent(component: ComponentNode): string {
  switch (component.type) {
    case 'Button':
      return `export default function ${component.id}() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      ${component.props.text || 'Button'}
    </button>
  )
}
`

    case 'Text':
      return `export default function ${component.id}() {
  return <p>${component.props.content || 'Text content'}</p>
}
`

    case 'Heading':
      const HeadingTag = component.props.level || 'h2'
      return `export default function ${component.id}() {
  return <${HeadingTag} className="font-bold">${component.props.content || 'Heading'}</${HeadingTag}>
}
`

    case 'Container':
      const childrenCode = component.children
        .map((child) => `      <${child.id} />`)
        .join('\n')

      return `${component.children.map((c) => `import ${c.id} from './${c.id}'`).join('\n')}

export default function ${component.id}() {
  return (
    <div className="container mx-auto" style={{ maxWidth: '${component.props.maxWidth || '1200px'}', padding: '${component.props.padding || '16px'}' }}>
${childrenCode}
    </div>
  )
}
`

    default:
      return `export default function ${component.id}() {
  return <div>{/* ${component.type} component */}</div>
}
`
  }
}

function generateGlobalCSS(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: var(--font-sans);
}
`
}
