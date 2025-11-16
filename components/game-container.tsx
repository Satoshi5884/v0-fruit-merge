'use client'

import { useRef, useEffect } from 'react'
import GameCanvas from './game-canvas'

interface GameContainerProps {
  gameStatus: 'ready' | 'playing' | 'gameover' | 'paused'
  onGameStart: () => void
  onGameOver: (score: number) => void
  onScoreChange: (score: number) => void
  onNextFruitChange: (level: number) => void
}

export default function GameContainer({
  gameStatus,
  onGameStart,
  onGameOver,
  onScoreChange,
  onNextFruitChange
}: GameContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-300"
      style={{ aspectRatio: '9 / 16' }}
    >
      <GameCanvas
        gameStatus={gameStatus}
        onGameStart={onGameStart}
        onGameOver={onGameOver}
        onScoreChange={onScoreChange}
        onNextFruitChange={onNextFruitChange}
      />
    </div>
  )
}
