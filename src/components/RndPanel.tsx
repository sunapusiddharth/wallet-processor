import { Rnd } from 'react-rnd'
import { useGridStore } from '../store/gridStore'
import { PanelWrapper } from './PanelWrapper'

type RndPanelProps = {
  id: string
  children: React.ReactNode
}

export const RndPanel = ({ id, children }: RndPanelProps) => {
  const layout = useGridStore((s) => s.layouts.find((l) => l.id === id))
  const updateLayout = useGridStore((s) => s.updateLayout)

  if (!layout) return null

  return (
    <Rnd
      dragHandleClassName="drag-handle"
      size={{ width: layout.width, height: layout.height }}
      position={{ x: layout.x, y: layout.y }}
      onDragStop={(e, d) => updateLayout(id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateLayout(id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          x: position.x,
          y: position.y,
        })
      }}
      bounds="parent"
      enableResizing
      className="absolute z-50 border border-zinc-700 bg-zinc-900 rounded shadow-md overflow-hidden"
    >
      <PanelWrapper id={id} title={`Panel ${id}`}>
        {children}
      </PanelWrapper>
    </Rnd>
  )
}
