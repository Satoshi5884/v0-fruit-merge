'use client'

import { useState, useCallback } from 'react'
import Header from './header'
import GameHud from './game-hud'
import GameContainer from './game-container'
import ControlPanel from './control-panel'
import GameOverModal from './game-over-modal'

export default function GamePage() {
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [nextFruitLevel, setNextFruitLevel] = useState(0)
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'gameover' | 'paused'>('ready')
  const [gameKey, setGameKey] = useState(0)

  const handleGameStart = useCallback(() => {
    setGameStatus('playing')
    setScore(0)
  }, [])

  const handleGameOver = useCallback((finalScore: number) => {
    setGameStatus('gameover')
    setBestScore(prev => Math.max(prev, finalScore))
  }, [])

  const handleScoreChange = useCallback((newScore: number) => {
    setScore(newScore)
  }, [])

  const handleNextFruitChange = useCallback((level: number) => {
    setNextFruitLevel(level)
  }, [])

  const handleRestart = () => {
    setGameKey(prev => prev + 1)
    setGameStatus('ready')
    setScore(0)
  }

  const handlePause = () => {
    setGameStatus(gameStatus === 'paused' ? 'playing' : 'paused')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-pink-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-4">
        <GameHud 
          score={score} 
          bestScore={bestScore} 
          nextFruitLevel={nextFruitLevel}
        />
        
        <GameContainer
          key={gameKey}
          gameStatus={gameStatus}
          onGameStart={handleGameStart}
          onGameOver={handleGameOver}
          onScoreChange={handleScoreChange}
          onNextFruitChange={handleNextFruitChange}
        />
        
        <ControlPanel
          gameStatus={gameStatus}
          onRestart={handleRestart}
          onPause={handlePause}
        />
      </div>

      <GameOverModal
        isOpen={gameStatus === 'gameover'}
        score={score}
        bestScore={bestScore}
        onRestart={handleRestart}
      />
    </div>
  )
}
