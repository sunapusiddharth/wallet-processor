import ReconnectingWebSocket from 'reconnecting-websocket'
import { SwapData } from '../interfaces'

const socketUrl = 'wss://your-socket-endpoint'

// Ensure WebSocket class is provided, only in browser
const rws =
  typeof window !== 'undefined'
    ? new ReconnectingWebSocket(socketUrl, [], {
        WebSocket: window.WebSocket,
      })
    : null

export const subscribeToTrades = (onMessage: (data: SwapData[]) => void) => {
  if (!rws) return

  rws.addEventListener('message', (event) => {
    try {
      const data: SwapData[] = JSON.parse(event.data)
      onMessage(data)
    } catch (err) {
      console.warn('TradeSocket JSON parse error:', err)
    }
  })
}
