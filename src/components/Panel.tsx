import { useGridStore } from '../store/gridStore'
import { CoinPanelItem } from './CoinPanelItem'
import { TraderPanelItem } from './TraderPanelItem'

type PanelProps = {
  id: string
  type: 'TraderPanelItem' | 'CoinPanelItem'
  props: Record<string, any> // Ideally replace with more specific prop types later
}

const ComponentMap = {
    TraderPanelItem,
  CoinPanelItem,
} as const

export const Panel = ({ id, type, props }: PanelProps) => {
  const removePanel = useGridStore((s) => s.removePanel)

  const handleModal = () => {
    // Optionally open modal here via zustand or context
  }

  const Component = ComponentMap[type]
  if (!Component) return null // Graceful fallback

  return (
    <div className="p-2 relative border border-zinc-700 rounded bg-zinc-900 shadow-md">
      <div className="absolute top-1 right-1 flex gap-1">
        <button onClick={handleModal} title="Open in Modal" className="text-xs text-white hover:text-blue-400">🗖</button>
        <button onClick={() => removePanel(id)} title="Remove" className="text-xs text-white hover:text-red-500">✕</button>
      </div>
      <Component {...props} />
    </div>
  )
}
