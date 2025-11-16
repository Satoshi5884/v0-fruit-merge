'use client'

import { useRef, useEffect, useState } from 'react'
import { GameEngine } from '@/game/engine'
import { Button } from './ui/button'

interface GameCanvasProps {
  gameStatus: 'ready' | 'playing' | 'gameover' | 'paused'
  onGameStart: () => void
  onGameOver: (score: number) => void
  onScoreChange: (score: number) => void
  onNextFruitChange: (level: number) => void
}

export default function GameCanvas({
  gameStatus,
  onGameStart,
  onGameOver,
  onScoreChange,
  onNextFruitChange
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const [isReady, setIsReady] = useState(false)
  const callbacksRef = useRef({ onGameOver, onScoreChange, onNextFruitChange })

  useEffect(() => {
    callbacksRef.current = { onGameOver, onScoreChange, onNextFruitChange }
  }, [onGameOver, onScoreChange, onNextFruitChange])

  useEffect(() => {
    console.log('[v0] GameCanvas mounted')
    const canvas = canvasRef.current
    if (!canvas) return

    console.log('[v0] Creating GameEngine')
    const engine = new GameEngine(canvas, {
      onGameOver: (score) => callbacksRef.current.onGameOver(score),
      onScoreChange: (score) => callbacksRef.current.onScoreChange(score),
      onNextFruitChange: (level) => callbacksRef.current.onNextFruitChange(level)
    })
    
    engineRef.current = engine
    engine.init().then(() => {
      console.log('[v0] GameEngine initialized')
      setIsReady(true)
    })

    return () => {
      console.log('[v0] GameCanvas unmounting')
      if (engineRef.current) {
        engineRef.current.destroy()
      }
    }
  }, []) // 依存配列を空にして初回のみ実行

  useEffect(() => {
    if (!engineRef.current) return

    switch (gameStatus) {
      case 'playing':
        engineRef.current.start()
        break
      case 'paused':
        engineRef.current.pause()
        break
      case 'ready':
        engineRef.current.reset()
        break
    }
  }, [gameStatus])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current) return
    
    if (gameStatus === 'ready') {
      onGameStart()
      return
    }

    if (gameStatus === 'playing') {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      
      engineRef.current.dropFruit(x)
    }
  }

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || gameStatus !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    
    engineRef.current.moveCursor(x)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || gameStatus !== 'playing') return

    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    
    engineRef.current.moveCursor(x)
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer touch-none"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onTouchMove={handleTouchMove}
      />
      
      {gameStatus === 'ready' && isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white text-xl px-8 py-6 rounded-full shadow-2xl"
            onClick={onGameStart}
          >
            ゲームスタート
          </Button>
        </div>
      )}
    </>
  )
}
