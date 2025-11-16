import { Fruit } from './types'
import { LOGICAL_WIDTH, LOGICAL_HEIGHT, GRAVITY, RESTITUTION, FRICTION, DAMPING } from './constants'

export class Physics {
  private wallLeft = 0
  private wallRight = LOGICAL_WIDTH
  private floor = LOGICAL_HEIGHT

  update(fruits: Fruit[], dt: number): void {
    // 重力と速度更新
    fruits.forEach(fruit => {
      if (fruit.isMerging) return

      fruit.vy += GRAVITY * dt
      fruit.x += fruit.vx * dt
      fruit.y += fruit.vy * dt

      // 角速度と回転
      if (fruit.rotation !== undefined && fruit.angularVelocity !== undefined) {
        fruit.rotation += fruit.angularVelocity * dt
        fruit.angularVelocity *= DAMPING
      }

      // 減衰
      fruit.vx *= DAMPING
      fruit.vy *= DAMPING
    })

    // 壁との衝突
    fruits.forEach(fruit => {
      if (fruit.isMerging) return

      // 左壁
      if (fruit.x - fruit.radius < this.wallLeft) {
        fruit.x = this.wallLeft + fruit.radius
        fruit.vx = -fruit.vx * RESTITUTION
      }

      // 右壁
      if (fruit.x + fruit.radius > this.wallRight) {
        fruit.x = this.wallRight - fruit.radius
        fruit.vx = -fruit.vx * RESTITUTION
      }

      // 床
      if (fruit.y + fruit.radius > this.floor) {
        fruit.y = this.floor - fruit.radius
        fruit.vy = -fruit.vy * RESTITUTION
        fruit.vx *= FRICTION

        if (Math.abs(fruit.vy) < 10) {
          fruit.vy = 0
        }
      }
    })

    // フルーツ同士の衝突
    for (let i = 0; i < fruits.length; i++) {
      for (let j = i + 1; j < fruits.length; j++) {
        this.resolveCollision(fruits[i], fruits[j])
      }
    }
  }

  private resolveCollision(f1: Fruit, f2: Fruit): void {
    if (f1.isMerging || f2.isMerging) return

    const dx = f2.x - f1.x
    const dy = f2.y - f1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDist = f1.radius + f2.radius

    if (distance < minDist) {
      // 位置補正
      const overlap = minDist - distance
      const nx = dx / distance
      const ny = dy / distance

      const move = overlap / 2
      f1.x -= nx * move
      f1.y -= ny * move
      f2.x += nx * move
      f2.y += ny * move

      // 速度の反発
      const dvx = f2.vx - f1.vx
      const dvy = f2.vy - f1.vy
      const dotProduct = dvx * nx + dvy * ny

      if (dotProduct < 0) {
        const impulse = -(1 + RESTITUTION) * dotProduct / 2

        f1.vx -= impulse * nx
        f1.vy -= impulse * ny
        f2.vx += impulse * nx
        f2.vy += impulse * ny
      }
    }
  }

  checkMerge(f1: Fruit, f2: Fruit): boolean {
    if (f1.level !== f2.level) {
      return false
    }
    if (f1.isMerging || f2.isMerging) {
      return false
    }

    const dx = f2.x - f1.x
    const dy = f2.y - f1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const minDist = f1.radius + f2.radius

    const isColliding = distance < minDist * 1.1
    
    if (isColliding) {
      console.log('[v0] Merge check - level:', f1.level, 'distance:', distance.toFixed(2), 'minDist:', minDist.toFixed(2), 'ratio:', (distance / minDist).toFixed(2))
    }

    return isColliding
  }
}
