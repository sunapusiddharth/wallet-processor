import ReconnectingWebSocket from 'reconnecting-websocket'
import { CoinStats } from '../interfaces/index'

const socketUrl = 'wss://your-coinstats-endpoint'

// Pass native WebSocket explicitly to avoid "no valid class" error
const rws = typeof window !== 'undefined'
  ? new ReconnectingWebSocket(socketUrl, [], {
      WebSocket: window.WebSocket,
    })
  : null

export const subscribeToCoinStats = (onMessage: (coins: CoinStats[]) => void) => {
  if (!rws) return

  rws.addEventListener('message', (event) => {
    try {
      const data: CoinStats[] = JSON.parse(event.data)
      onMessage(data)
    } catch (_) {
      console.error('Failed to parse CoinStats message', event.data)
    }
  })
}
