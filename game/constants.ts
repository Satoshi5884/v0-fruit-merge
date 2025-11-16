// ゲームフィールドの論理サイズ
export const LOGICAL_WIDTH = 360
export const LOGICAL_HEIGHT = 640

// 物理パラメータ
export const GRAVITY = 980 // px/s^2
export const RESTITUTION = 0.3 // 反発係数
export const FRICTION = 0.8 // 摩擦係数
export const DAMPING = 0.98 // 減衰係数

// ゲームオーバーライン
export const GAME_OVER_LINE = 100

// フルーツレベル定義
export const FRUIT_LEVELS = [
  { id: 0, name: 'さくらんぼ', emoji: '🍒', radius: 16, score: 10, color: '#ff4757' },
  { id: 1, name: 'いちご', emoji: '🍓', radius: 20, score: 25, color: '#ff6b81' },
  { id: 2, name: 'ぶどう', emoji: '🍇', radius: 24, score: 50, color: '#a55eea' },
  { id: 3, name: 'みかん', emoji: '🍊', radius: 28, score: 100, color: '#ffa502' },
  { id: 4, name: 'レモン', emoji: '🍋', radius: 32, score: 150, color: '#f9ca24' },
  { id: 5, name: 'りんご', emoji: '🍎', radius: 38, score: 200, color: '#ee5a6f' },
  { id: 6, name: '桃', emoji: '🍑', radius: 44, score: 300, color: '#ffd3b6' },
  { id: 7, name: 'パイナップル', emoji: '🍍', radius: 52, score: 500, color: '#ffd93d' },
  { id: 8, name: 'メロン', emoji: '🍈', radius: 60, score: 800, color: '#7bed9f' },
  { id: 9, name: 'スイカ', emoji: '🍉', radius: 70, score: 1500, color: '#ff6348' },
]

// 落とせるフルーツのレベル範囲
export const DROP_FRUIT_MAX_LEVEL = 4
