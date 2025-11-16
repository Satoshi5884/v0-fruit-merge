import { Fruit } from './types'
import { FRUIT_LEVELS } from './constants'
import { Physics } from './physics'

export class MergeLogic {
  private physics: Physics
  private nextId = 1000

  constructor(physics: Physics) {
    this.physics = physics
  }

  checkAndMerge(fruits: Fruit[]): { newFruits: Fruit[], score: number } {
    let score = 0
    const toRemove = new Set<number>()
    const toAdd: Fruit[] = []

    for (let i = 0; i < fruits.length; i++) {
      if (toRemove.has(fruits[i].id)) continue

      for (let j = i + 1; j < fruits.length; j++) {
        if (toRemove.has(fruits[j].id)) continue

        const shouldMerge = this.physics.checkMerge(fruits[i], fruits[j])
        
        if (shouldMerge) {
          const f1 = fruits[i]
          const f2 = fruits[j]

          console.log('[v0] Merging fruits! Level:', f1.level, '→', f1.level + 1)

          // 最大レベルチェック
          if (f1.level >= FRUIT_LEVELS.length - 1) {
            console.log('[v0] Max level reached, cannot merge')
            continue
          }

          // マージ処理
          toRemove.add(f1.id)
          toRemove.add(f2.id)

          const newLevel = f1.level + 1
          const newFruit: Fruit = {
            id: this.nextId++,
            level: newLevel,
            x: (f1.x + f2.x) / 2,
            y: (f1.y + f2.y) / 2,
            vx: (f1.vx + f2.vx) / 2,
            vy: -100, // 少し跳ねる
            radius: FRUIT_LEVELS[newLevel].radius,
            rotation: 0,
            angularVelocity: 0
          }

          toAdd.push(newFruit)
          score += FRUIT_LEVELS[newLevel].score

          break
        }
      }
    }

    if (toRemove.size > 0) {
      console.log('[v0] Total merged:', toRemove.size / 2, 'pairs, score gained:', score)
    }

    const newFruits = fruits.filter(f => !toRemove.has(f.id)).concat(toAdd)
    return { newFruits, score }
  }

  reset(): void {
    this.nextId = 1000
  }
}
