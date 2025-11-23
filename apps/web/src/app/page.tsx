import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">Devbase Studio</div>
            <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">
              ALPHA
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/builder/demo">
              <Button>Try Builder</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          The WordPress of React
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Build production-ready web applications visually.
          <br />
          Zero code required, infinite customization possible.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/builder/demo">
            <Button size="lg" className="text-lg">
              Open Visual Builder →
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg">
            View Documentation
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">Core Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Visual Builder</CardTitle>
              <CardDescription>
                Drag-and-drop interface with 15 essential components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Infinite canvas with zoom & pan</li>
                <li>• Real-time preview</li>
                <li>• Undo/Redo (100 states)</li>
                <li>• Component properties editor</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
              <CardDescription>
                Clean, production-ready Next.js code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• TypeScript throughout</li>
                <li>• Tailwind CSS styling</li>
                <li>• Component-based architecture</li>
                <li>• Export & deploy anywhere</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Free & Open Source</CardTitle>
              <CardDescription>
                MIT licensed, no vendor lock-in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 100% free forever</li>
                <li>• Full code ownership</li>
                <li>• Self-hostable</li>
                <li>• Community-driven</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Components */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-12 text-center text-3xl font-bold">15 MVP Components</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {[
            'Button',
            'Text',
            'Heading',
            'Link',
            'Image',
            'Divider',
            'Container',
            'Card',
            'Grid',
            'Flex',
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'Alert',
          ].map((component) => (
            <div
              key={component}
              className="rounded-lg border bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-medium">{component}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="mb-6 text-4xl font-bold">Start Building Today</h2>
        <p className="mb-8 text-xl text-gray-600">
          Open source, free forever, no credit card required
        </p>
        <Link href="/builder/demo">
          <Button size="lg" className="text-lg">
            Launch Visual Builder →
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            Built with ❤️ by Oxford Pierpont
            <br />
            MIT License • Open Source • Community Driven
          </p>
        </div>
      </footer>
    </div>
  )
}
