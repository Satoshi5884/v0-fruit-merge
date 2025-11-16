import { FRUIT_LEVELS } from '@/game/constants'

interface GameHudProps {
  score: number
  bestScore: number
  nextFruitLevel: number
}

export default function GameHud({ score, bestScore, nextFruitLevel }: GameHudProps) {
  const nextFruit = FRUIT_LEVELS[nextFruitLevel]
  
  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-pink-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">スコア</p>
          <p className="text-3xl font-bold text-pink-600">{score}</p>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">ベストスコア</p>
          <p className="text-3xl font-bold text-orange-600">{bestScore}</p>
        </div>
        
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-600 mb-2">次のフルーツ</p>
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl shadow-md border-2"
            style={{ 
              backgroundColor: nextFruit.color,
              borderColor: nextFruit.color
            }}
          >
            {nextFruit.emoji}
          </div>
        </div>
      </div>
    </div>
  )
}
