import {
  MinusIcon,
  ArrowLeftStartOnRectangleIcon,
  WindowIcon,
} from '@heroicons/react/24/solid'

interface PanelWrapperProps {
  id: string
  title: string
  children: React.ReactNode
  onMinimize?: () => void
  onMaximize?: () => void
  onExport?: () => void
  isMinimized?: boolean
}

export const PanelWrapper = ({
  id,
  title,
  children,
  onMinimize,
  onMaximize,
  onExport,
  isMinimized = false,
}: PanelWrapperProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="drag-handle flex items-center justify-between px-3 py-2 bg-zinc-800 border-b border-zinc-700 cursor-move">
        <h3 className="text-sm font-semibold text-gray-200 truncate">{title}</h3>
        <div className="flex space-x-2">
          <button onClick={onMinimize} title="Minimize">
            <MinusIcon className="text-gray-400 hover:text-white w-4 h-4" />
          </button>
          <button onClick={onMaximize} title="Maximize">
            <WindowIcon className="text-gray-400 hover:text-white w-4 h-4" />
          </button>
          <button onClick={onExport} title="Export">
            <ArrowLeftStartOnRectangleIcon className="text-gray-400 hover:text-white w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-3">
          {children}
        </div>
      )}
    </div>
  )
}
