

import { de, faker } from '@faker-js/faker'
import { BucketResult, CoinActivity, Memecoin, SwapData, TraderDetail, TraderSummary } from '../interfaces'

export function generateSwapData(): SwapData {
    return {
        coinName: faker.finance.currencyCode(),
        traderAddress: faker.finance.ethereumAddress(),
        pnl: parseFloat(faker.finance.amount({ min: -500, max: 500, dec: 2 })),
        totalSpent: parseFloat(faker.finance.amount({ min: 10, max: 2000, dec: 2 })),
        timestamp: new Date().toISOString(),
        isBuy: faker.datatype.boolean(),
        price: parseFloat(faker.finance.amount({ min: 1, max: 1000, dec: 2 })),
    }
}




const durations = ['5m', '15m', '30m', '1h', '6h', '24h']

export function generateTraderSummary(): TraderSummary {
    const buckets: BucketResult[] = durations.map((duration) => {
        const invested = faker.finance.amount({ min: 100, max: 1000, dec: 2 })
        const made = faker.finance.amount({ min: -200, max: 500, dec: 2 })
        return {
            duration,
            amountInvested: invested,
            amountMade: made,
            exitValue: invested + made,
        }
    })

    return {
        traderAddr: faker.finance.ethereumAddress(),
        buckets,
        score: faker.finance.amount({ min: 0, max: 100 }),
        level: faker.helpers.arrayElement([1, 2, 3]),
        lastJobRun: faker.date.recent().toISOString(),
        timestamp: faker.date.recent().toISOString(),
        kolsWhalesCount: faker.finance.amount({ min: 0, max: 50 }),
        totalProfitIMade: faker.finance.amount({ min: -1000, max: 5000 }),
        coin: faker.finance.currencyCode(),
    }
}



export function generateMemecoin(): Memecoin {
    return {
        id: faker.string.uuid(),
        source: faker.helpers.arrayElement(['binance', 'dextools']),
        symbol: faker.finance.currencyCode(),
        name: faker.company.name(),
        chain: faker.helpers.arrayElement(['ethereum', 'bsc', 'polygon']),
        exchange: faker.helpers.arrayElement(['binance', 'uniswap', 'pancakeswap']),
        contractAddress: faker.finance.ethereumAddress(),
        price: parseFloat(faker.finance.amount({ min: 0.0001, max: 10, dec: 6 })),
        priceUSD: parseFloat(faker.finance.amount({ min: 0.0001, max: 10, dec: 6 })),
        volume24h: parseFloat(faker.finance.amount({ min: 1000, max: 1000000, dec: 2 })),
        volume24hUSD: parseFloat(faker.finance.amount({ min: 1000, max: 1000000, dec: 2 })),
        priceChange24h: parseFloat(faker.finance.amount({ min: -50, max: 50, dec: 2 })),
        liquidityUSD: parseFloat(faker.finance.amount({ min: 10000, max: 10000000, dec: 2 })),
        marketCapUSD: parseFloat(faker.finance.amount({ min: 100000, max: 100000000, dec: 2 })),
        fdvUSD: parseFloat(faker.finance.amount({ min: 100000, max: 100000000, dec: 2 })),
        txns24h: faker.number.int({ min: 100, max: 10000 }),
        socialScore: parseFloat(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
        timestamp: new Date().toISOString(),
        firstSeen: faker.date.past().toISOString(),
        metrics: {
            volatility24h: parseFloat(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
            volumeToMCAP: parseFloat(faker.finance.amount({ min: 0, max: 1, dec: 4 })),
            buySellRatio: parseFloat(faker.finance.amount({ min: 0, max: 2, dec: 2 })),
            whaleActivity: parseFloat(faker.finance.amount({ min: 0, max: 100, dec: 2 })),
        },
    }
}




export function generateCoinActivityData(
    count = 10
): CoinActivity[] {
    return Array.from({ length: count }, () => {
        const numTraders = faker.number.int({ min: 5, max: 50 })
        const traders = Array.from({ length: numTraders }, () =>
            faker.finance.ethereumAddress()
        )
        return {
            coin_name: faker.finance.currencyCode(),
            coin_symbol: faker.finance.currencyCode().slice(0, 3),
            traders_count: numTraders,
            traders_addresses: traders,
            coin_price: parseFloat(faker.finance.amount({ min: 0.01, max: 10, dec: 4 })),
        }
    })
}


export function generateTraderDetail(
    trader_address: string
): TraderDetail {
    return {
        trader_address,
        amount_invested: parseFloat(faker.finance.amount({ min: 10, max: 2000, dec: 2 })),
        profit_5_min: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_10_min: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_15_min: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_30_min: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_1_hr: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_6_hr: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),
        profit_24_hr: parseFloat(faker.finance.amount({ min: -50, max: 100, dec: 2 })),

    }
}