import { getShareData } from '../../../actions/generate-share-link'
import FontPreview from '../../../components/font-preview'
import { Nav } from '../../../components/nav'

export default async function SharePage({ params }: { params: { id: string } }) {
  const shareData = await getShareData(params.id)

  if (!shareData) {
    return <div>Share link not found or expired.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Shared Font Preview</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <FontPreview initialData={shareData} />
        </div>
      </main>
    </div>
  )
}

