import { Nav } from '../components/nav'
import FontPreview from '../components/font-preview'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Font Preview Generator</h1>
          <sub>v1</sub>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <FontPreview />
        </div>
      </main>
    </div>
  )
}

