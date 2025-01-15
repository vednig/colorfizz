import { Nav } from '../components/nav'
import FontPreview from '../components/font-preview'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Font Preview Generator</h1>
          <sub>v1<a href="https://www.producthunt.com/posts/font-preview-generator?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-font&#0045;preview&#0045;generator" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=783945&theme=light&t=1736938898805" alt="Font&#0032;Preview&#0032;Generator - Gradients&#0032;&#0043;&#0032;💗 | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a></sub>
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

