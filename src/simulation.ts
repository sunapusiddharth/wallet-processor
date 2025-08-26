// lib/simulation.ts

import { faker } from '@faker-js/faker'
import type { CoinStats, SwapData } from './interfaces'


/**
 * Generate a pool of unique trader addresses.
 */
export const generateTraderAddresses = (count: number): string[] =>
  Array.from({ length: count }, () => faker.finance.ethereumAddress())

/**
 * Generate a pool of mock coins with initial stats.
 */
export const generateCoins = (count: number): CoinStats[] =>
  Array.from({ length: count }, () => ({
    coinName: faker.finance.currencyCode(),
    createdOn: faker.date.past(),
    amount: faker.number.float({ min: 1_000, max: 1_000_000, fractionDigits: 1 }),
    audit: faker.datatype.boolean(),
    volume: faker.number.float({ min: 10_000, max: 100_000_000, fractionDigits: 2 }),
    swaps: 0,
    traderSwaps: 0,
    liquidity: faker.number.float({ min: 1_000, max: 500_000, fractionDigits: 2 }),
    volatility: faker.number.float({ min: 0.1, max: 5, fractionDigits: 2 }),
    marketCap: faker.number.float({ min: 1_000_000, max: 500_000_000, fractionDigits: 1 }),

    change5Min: 0,
    change15Min: 0,
    change30Min: 0,
    change1Hr: 0,
    change4Hrs: 0,
    change12Hrs: 0,
    change24Hrs: 0,

    traderCount: 0,
  }))

/**
 * Simulate swap events for a pool of trader addresses on your coin pool.
 *
 * @param traderAddresses   Array of Ethereum addresses (strings)
 * @param coins             Array of CoinStats (mutated in-place)
 * @param opts.maxCoinPerTrader  Max distinct coins each address can trade
 * @param opts.maxSwapsPerCoin   Max swaps per (address, coin) pair
 * @param opts.timeWindowDays    How far back to timestamp swaps
 */
export function simulateSwaps(
  traderAddresses: string[],
  coins: CoinStats[],
  opts: {
    maxCoinPerTrader?: number
    maxSwapsPerCoin?: number
    timeWindowDays?: number
  } = {}
): { swaps: SwapData[]; updatedCoins: CoinStats[] } {
  const {
    maxCoinPerTrader = 5,
    maxSwapsPerCoin = 10,
    timeWindowDays = 7,
  } = opts

  const swaps: SwapData[] = []
  const seenPairs = new Set<string>() // track first-time (address|coin)

  for (const addr of traderAddresses) {
    // choose 1..maxCoinPerTrader random coins
    const selected = faker.helpers.shuffle(coins).slice(
      0,
      faker.number.int({ min: 1, max: Math.min(maxCoinPerTrader, coins.length) })
    )

    for (const coin of selected) {
      // 1..maxSwapsPerCoin swaps per (addr, coin)
      const rounds = faker.number.int({ min: 1, max: maxSwapsPerCoin })
      for (let i = 0; i < rounds; i++) {
        const totalSpent = faker.number.float({
          min: 100,
          max: 50_000,
          fractionDigits: 2,
        })
        const isBuy = faker.datatype.boolean()
        const pnl = faker.number.float({
          min: -0.2 * totalSpent,
          max: 0.2 * totalSpent,
          fractionDigits: 2,
        })
        const timestamp = faker.date.recent({days:timeWindowDays})

        swaps.push({
          coinName: coin.coinName,
          traderAddress: addr,
          pnl,
          totalSpent,
          timestamp,
          isBuy,
        })

        // update coin stats
        coin.volume += totalSpent
        coin.swaps++
        coin.traderSwaps++

        const key = `${addr}|${coin.coinName}`
        if (!seenPairs.has(key)) {
          seenPairs.add(key)
          coin.traderCount++
        }

        // adjust liquidity ±20% of totalSpent
        const liqChange = faker.number.float({
          min: -0.2 * totalSpent,
          max: 0.2 * totalSpent,
          fractionDigits: 2,
        })
        coin.liquidity = Math.max(0, coin.liquidity + liqChange)

        // marketCap: buy adds 100%, sell subtracts 50%
        coin.marketCap += isBuy ? totalSpent : -totalSpent * 0.5
      }
    }
  }

  // finalize “change” and volatility
  coins.forEach((coin) => {
    coin.change5Min = faker.number.float({ min: -5, max: 5, fractionDigits: 2 })
    coin.change15Min = faker.number.float({ min: -5, max: 5, fractionDigits: 2 })
    coin.change30Min = faker.number.float({ min: -10, max: 10, fractionDigits: 2 })
    coin.change1Hr = faker.number.float({ min: -15, max: 15, fractionDigits: 2 })
    coin.change4Hrs = faker.number.float({ min: -20, max: 20, fractionDigits: 2 })
    coin.change12Hrs = faker.number.float({ min: -25, max: 25, fractionDigits: 2 })
    coin.change24Hrs = faker.number.float({ min: -30, max: 30, fractionDigits: 2 })
    coin.volatility = faker.number.float({ min: 0.05, max: 10, fractionDigits: 2 })
  })

  return { swaps, updatedCoins: coins }
}

export function processLiveSwap(
    swap: SwapData,
    coins: CoinStats[]
  ): CoinStats | null {
    const coin = coins.find((c) => c.coinName === swap.coinName)
    if (!coin) return null
  
    coin.volume += swap.totalSpent
    coin.swaps += 1
    coin.traderSwaps += 1
  
    coin.liquidity = Math.max(
      0,
      coin.liquidity +
        faker.number.float({
          min: -0.1 * swap.totalSpent,
          max: 0.2 * swap.totalSpent,
          fractionDigits: 2,
        })
    )
  
    coin.marketCap += swap.isBuy ? swap.totalSpent : -0.5 * swap.totalSpent
  
    coin.volatility = faker.number.float({ min: 0.05, max: 5, fractionDigits: 2 })
    coin.change5Min = faker.number.float({ min: -5, max: 5, fractionDigits: 2 })
  
    return coin
  }
  