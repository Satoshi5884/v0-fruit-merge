import { Button } from './ui/button'
import { RotateCcw, Pause, Play } from 'lucide-react'

interface ControlPanelProps {
  gameStatus: 'ready' | 'playing' | 'gameover' | 'paused'
  onRestart: () => void
  onPause: () => void
}

export default function ControlPanel({ gameStatus, onRestart, onPause }: ControlPanelProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onRestart}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-pink-300"
      >
        <RotateCcw className="w-5 h-5" />
        リスタート
      </Button>
      
      {gameStatus === 'playing' || gameStatus === 'paused' ? (
        <Button
          variant="outline"
          size="lg"
          onClick={onPause}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-pink-300"
        >
          {gameStatus === 'paused' ? (
            <>
              <Play className="w-5 h-5" />
              再開
            </>
          ) : (
            <>
              <Pause className="w-5 h-5" />
              一時停止
            </>
          )}
        </Button>
      ) : null}
    </div>
  )
}
