import { CoinStats } from '../interfaces/index'
import { formatDistanceToNow } from 'date-fns'

const ChangeBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center min-w-[40px]">
    <span className="text-sm font-semibold text-gray-100">{value.toFixed(2)}</span>
    <span className="text-[10px] text-gray-500">{label}</span>
  </div>
)

const CoinItem = ({ data }: { data: CoinStats }) => {
  const {
    coinName,
    createdOn,
    amount,
    audit,
    volume,
    swaps,
    traderSwaps,
    liquidity,
    volatility,
    marketCap,
    change5Min,
    change15Min,
    change30Min,
    change1Hr,
    change4Hrs,
    change12Hrs,
    change24Hrs,
    traderCount,
  } = data

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 mb-3 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-1">
        <a
          href={`https://www.dextools.io/app/en/token/${coinName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold text-white hover:text-blue-400"
        >
          {coinName}
        </a>
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(createdOn))} ago
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-2 text-xs text-gray-400">
        <div><span className="block text-gray-300 text-sm">{amount}</span>amt</div>
        <div><span className="block text-gray-300 text-sm">{volume}</span>vol</div>
        <div><span className="block text-gray-300 text-sm">{swaps}</span>swaps</div>
        <div><span className="block text-gray-300 text-sm">{liquidity}</span>liq</div>
        <div><span className="block text-gray-300 text-sm">{marketCap}</span>cap</div>
        <div><span className="block text-gray-300 text-sm">{volatility}</span>vola</div>
        <div><span className="block text-gray-300 text-sm">{traderSwaps}</span>tswaps</div>
        <div><span className="block text-gray-300 text-sm">{traderCount}</span>traders</div>
        <div><span className="block text-gray-300 text-sm">{audit ? '✔' : '—'}</span>audit</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 justify-start">
        <ChangeBox value={change5Min} label="5m" />
        <ChangeBox value={change15Min} label="15m" />
        <ChangeBox value={change30Min} label="30m" />
        <ChangeBox value={change1Hr} label="1h" />
        <ChangeBox value={change4Hrs} label="4h" />
        <ChangeBox value={change12Hrs} label="12h" />
        <ChangeBox value={change24Hrs} label="24h" />
      </div>
    </div>
  )
}

export default CoinItem
