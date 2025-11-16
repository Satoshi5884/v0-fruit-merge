import { Cherry } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b border-pink-200 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cherry className="w-8 h-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-pink-600">フルーツマージ</h1>
        </div>
      </div>
    </header>
  )
}
