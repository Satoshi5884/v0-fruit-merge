export interface Fruit {
  id: number
  level: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  isMerging?: boolean
  rotation?: number
  angularVelocity?: number
}

export interface GameState {
  fruits: Fruit[]
  nextFruitLevel: number
  score: number
  status: 'ready' | 'playing' | 'gameover' | 'paused'
  cursorX: number
  currentFruit: Fruit | null
  gameOverTimer: number
}

export interface GameCallbacks {
  onGameOver: (score: number) => void
  onScoreChange: (score: number) => void
  onNextFruitChange: (level: number) => void
}
