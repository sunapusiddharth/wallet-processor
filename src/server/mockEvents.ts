import { createServer } from 'http'
import { Server } from 'ws'
import { EventWrapper, EventType } from '../interfaces'
import { generateTraderAddresses, generateCoins, simulateSwaps } from '../simulation'
import { traderAddresses, coinPool } from '../api'


const server = createServer()
const wss = new Server({ server })

// Seed the same mock data used by the REST mocks
const { swaps: mockSwaps, updatedCoins: mockCoins } = simulateSwaps(traderAddresses, coinPool, {
    maxCoinPerTrader: 7,
    maxSwapsPerCoin: 15,
    timeWindowDays: 3,
})

const broadcast = (payload: EventWrapper) => {
    const json = JSON.stringify(payload)
    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(json)
        }
    })
}
wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected')

    const interval = setInterval(() => {
        const broadcastChance = Math.random()

        // Coin event: 60% chance
        if (broadcastChance < 0.6) {
            const coin = mockCoins[Math.floor(Math.random() * mockCoins.length)]
            if (coin) {
                const coinEvent: EventWrapper = {
                    event_type: EventType.CoinStats,
                    data: {
                        ...coin
                    },
                }
                broadcast(coinEvent)
            }

        }

        // Trader event: 40% chance
        if (broadcastChance > 0.4) {
            const swap = mockSwaps[Math.floor(Math.random() * mockSwaps.length)]
            if (swap) {
                const traderEvent: EventWrapper = {
                    event_type: EventType.TraderActivity,
                    data: {
                        ...swap
                    },
                }
                broadcast(traderEvent)
            }
        }

    }, 3000 + Math.floor(Math.random() * 2000)) // interval 3–5s

    ws.on('close', () => clearInterval(interval))
})


server.listen(8080, () => {
    console.log('✅ WebSocket server running at ws://localhost:8080')
})
