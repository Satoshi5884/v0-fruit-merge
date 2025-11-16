import { Button } from './ui/button'
import { Trophy } from 'lucide-react'

interface GameOverModalProps {
  isOpen: boolean
  score: number
  bestScore: number
  onRestart: () => void
}

export default function GameOverModal({ isOpen, score, bestScore, onRestart }: GameOverModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-pink-300">
        <div className="mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-pink-600 mb-2">ゲームオーバー</h2>
        </div>
        
        <div className="mb-8 space-y-4">
          <div>
            <p className="text-gray-600 mb-1">最終スコア</p>
            <p className="text-5xl font-bold text-pink-600">{score}</p>
          </div>
          
          <div>
            <p className="text-gray-600 mb-1">ベストスコア</p>
            <p className="text-3xl font-bold text-orange-600">{bestScore}</p>
          </div>
        </div>
        
        <Button
          size="lg"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xl py-6 rounded-full shadow-lg"
          onClick={onRestart}
        >
          もう一度プレイ
        </Button>
      </div>
    </div>
  )
}
