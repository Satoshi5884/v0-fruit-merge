import { Fruit, GameState, GameCallbacks } from './types'
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, FRUIT_LEVELS, DROP_FRUIT_MAX_LEVEL, GAME_OVER_LINE } from './constants'
import { Physics } from './physics'
import { MergeLogic } from './merge-logic'

export class GameEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private state: GameState
  private callbacks: GameCallbacks
  private physics: Physics
  private mergeLogic: MergeLogic
  private animationId: number | null = null
  private lastTime = 0
  private scale = 1
  private nextFruitId = 0

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    console.log('[v0] GameEngine constructor called')
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('[v0] Failed to get 2D context')
      throw new Error('Failed to get 2D context')
    }
    this.ctx = ctx
    this.callbacks = callbacks
    this.physics = new Physics()
    this.mergeLogic = new MergeLogic(this.physics)

    this.state = {
      fruits: [],
      nextFruitLevel: this.getRandomFruitLevel(),
      score: 0,
      status: 'ready',
      cursorX: LOGICAL_WIDTH / 2,
      currentFruit: null,
      gameOverTimer: 0
    }

    this.updateCanvasSize()
    window.addEventListener('resize', () => this.updateCanvasSize())
  }

  async init(): Promise<void> {
    console.log('[v0] GameEngine init called')
    this.updateCanvasSize()
    console.log('[v0] Canvas size:', this.canvas.width, 'x', this.canvas.height)
  }

  private updateCanvasSize(): void {
    const rect = this.canvas.getBoundingClientRect()
    this.canvas.width = rect.width * window.devicePixelRatio
    this.canvas.height = rect.height * window.devicePixelRatio
    this.scale = this.canvas.width / LOGICAL_WIDTH
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }

  private getRandomFruitLevel(): number {
    return Math.floor(Math.random() * (DROP_FRUIT_MAX_LEVEL + 1))
  }

  start(): void {
    console.log('[v0] GameEngine start called, current status:', this.state.status)
    if (this.state.status !== 'playing') {
      this.state.status = 'playing'
      this.createNextFruit()
      this.lastTime = performance.now()
      this.loop(this.lastTime)
      console.log('[v0] Game loop started')
    }
  }

  pause(): void {
    this.state.status = 'paused'
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  reset(): void {
    this.state = {
      fruits: [],
      nextFruitLevel: this.getRandomFruitLevel(),
      score: 0,
      status: 'ready',
      cursorX: LOGICAL_WIDTH / 2,
      currentFruit: null,
      gameOverTimer: 0
    }
    this.nextFruitId = 0
    this.mergeLogic.reset()
    this.callbacks.onScoreChange(0)
    this.callbacks.onNextFruitChange(this.state.nextFruitLevel)
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    
    this.render()
  }

  private createNextFruit(): void {
    const level = this.state.nextFruitLevel
    const fruit = FRUIT_LEVELS[level]

    this.state.currentFruit = {
      id: this.nextFruitId++,
      level,
      x: this.state.cursorX,
      y: 50,
      vx: 0,
      vy: 0,
      radius: fruit.radius,
      rotation: 0,
      angularVelocity: 0
    }

    this.state.nextFruitLevel = this.getRandomFruitLevel()
    this.callbacks.onNextFruitChange(this.state.nextFruitLevel)
  }

  moveCursor(canvasX: number): void {
    const logicalX = (canvasX / this.canvas.getBoundingClientRect().width) * LOGICAL_WIDTH
    const fruit = this.state.currentFruit
    
    if (fruit) {
      const clampedX = Math.max(
        fruit.radius,
        Math.min(LOGICAL_WIDTH - fruit.radius, logicalX)
      )
      this.state.cursorX = clampedX
      fruit.x = clampedX
    }
  }

  dropFruit(canvasX: number): void {
    console.log('[v0] dropFruit called - canvasX:', canvasX, 'status:', this.state.status, 'currentFruit:', !!this.state.currentFruit)
    
    if (this.state.status !== 'playing' || !this.state.currentFruit) {
      console.log('[v0] dropFruit blocked - status:', this.state.status, 'currentFruit:', !!this.state.currentFruit)
      return
    }

    const logicalX = (canvasX / this.canvas.getBoundingClientRect().width) * LOGICAL_WIDTH
    console.log('[v0] dropFruit - logicalX:', logicalX, 'fruit radius:', this.state.currentFruit.radius)
    
    this.state.currentFruit.x = Math.max(
      this.state.currentFruit.radius,
      Math.min(LOGICAL_WIDTH - this.state.currentFruit.radius, logicalX)
    )

    this.state.fruits.push(this.state.currentFruit)
    console.log('[v0] Fruit dropped! Total fruits:', this.state.fruits.length)
    
    this.state.currentFruit = null

    setTimeout(() => {
      if (this.state.status === 'playing') {
        console.log('[v0] Creating next fruit after drop')
        this.createNextFruit()
      }
    }, 500)
  }

  private loop(time: number): void {
    if (this.state.status !== 'playing') {
      console.log('[v0] Loop stopped, status:', this.state.status)
      return
    }

    const dt = Math.min((time - this.lastTime) / 1000, 0.016)
    this.lastTime = time

    this.update(dt)
    this.render()

    this.animationId = requestAnimationFrame((t) => this.loop(t))
  }

  private update(dt: number): void {
    this.physics.update(this.state.fruits, dt)

    const { newFruits, score } = this.mergeLogic.checkAndMerge(this.state.fruits)
    if (score > 0) {
      this.state.score += score
      this.callbacks.onScoreChange(this.state.score)
    }
    this.state.fruits = newFruits

    this.checkGameOver()
  }

  private checkGameOver(): void {
    const hasFruitAboveLine = this.state.fruits.some(
      fruit => fruit.y - fruit.radius < GAME_OVER_LINE
    )

    if (hasFruitAboveLine) {
      this.state.gameOverTimer += 1
      if (this.state.gameOverTimer > 120) {
        this.state.status = 'gameover'
        this.callbacks.onGameOver(this.state.score)
        if (this.animationId) {
          cancelAnimationFrame(this.animationId)
          this.animationId = null
        }
      }
    } else {
      this.state.gameOverTimer = 0
    }
  }

  private render(): void {
    const width = this.canvas.getBoundingClientRect().width
    const height = this.canvas.getBoundingClientRect().height

    this.ctx.clearRect(0, 0, width, height)

    // 背景グラデーション
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#e0f7fa')
    gradient.addColorStop(1, '#fff9e6')
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, width, height)

    // ゲームオーバーライン
    const lineY = (GAME_OVER_LINE / LOGICAL_HEIGHT) * height
    this.ctx.strokeStyle = this.state.gameOverTimer > 0 ? '#ff4757' : '#ff6b6b'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([10, 5])
    this.ctx.beginPath()
    this.ctx.moveTo(0, lineY)
    this.ctx.lineTo(width, lineY)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    // フルーツ描画
    this.state.fruits.forEach(fruit => this.drawFruit(fruit))

    // 操作中のフルーツ
    if (this.state.currentFruit) {
      this.drawFruit(this.state.currentFruit, 0.7)
    }
  }

  private drawFruit(fruit: Fruit, opacity = 1): void {
    const width = this.canvas.getBoundingClientRect().width
    const height = this.canvas.getBoundingClientRect().height
    
    const x = (fruit.x / LOGICAL_WIDTH) * width
    const y = (fruit.y / LOGICAL_HEIGHT) * height
    const radius = (fruit.radius / LOGICAL_WIDTH) * width

    const fruitData = FRUIT_LEVELS[fruit.level]

    this.ctx.save()
    this.ctx.globalAlpha = opacity

    // フルーツの円
    this.ctx.fillStyle = fruitData.color
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, Math.PI * 2)
    this.ctx.fill()

    // 境界線
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    // 絵文字
    this.ctx.font = `${radius * 1.2}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(fruitData.emoji, x, y)

    this.ctx.restore()
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('resize', () => this.updateCanvasSize())
  }
}
