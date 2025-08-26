// 'use client'
// import ReactGridLayout from 'react-grid-layout'
// import { useGridStore } from '../store/gridStore'
// import 'react-grid-layout/css/styles.css'
// import { Panel } from './Panel'
// import CoinsLiveStats from './CoinsLiveStats'
// import TradersLiveStats from './TradersLiveStats'
// import { useEffect, useState } from 'react'
// import { PanelWrapper } from './PanelWrapper'
// import { RankTable } from './RankTable'

// export const Dashboard = () => {
//   const { panels, layouts, updateLayout, persistState } = useGridStore()
//   const [panelState, setPanelState] = useState<Record<string, { minimized: boolean }>>({})
//   const [gridWidth, setGridWidth] = useState(1200); // default fallback

//   useEffect(() => {
//     const handleResize = () => {
//       setGridWidth(window.innerWidth - 32); // subtract padding/margin if needed
//     };

//     handleResize(); // initial set
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const toggleMinimize = (id: string) => {
//     setPanelState(prev => ({
//       ...prev,
//       [id]: { minimized: !prev[id]?.minimized }
//     }))
//   }

//   const maximizePanel = (id: string) => {
//     const updatedLayouts = layouts.map(layout => {
//       if (layout.i === id) {
//         return {
//           ...layout,
//           w: 12,
//           h: 8,
//           x: 0,
//           y: layout.y,
//           i: layout.i,
//         }
//       }
//       return layout
//     })

//     updateLayout(updatedLayouts)
//     persistState()
//   }

//   const exportPanel = (id: string) => {
//     alert(`Exporting panel ${id} to modal…`)
//   }

//   const staticPanels = [
//     {
//       id: 'static-trader-stats',
//       component: (
//         <PanelWrapper
//           id="static-trader-stats"
//           title="👤 Traders Live Stats"
//           isMinimized={panelState['static-trader-stats']?.minimized}
//           onMinimize={() => toggleMinimize('static-trader-stats')}
//           onMaximize={() => maximizePanel('static-trader-stats')}
//           onExport={() => exportPanel('static-trader-stats')}
//         >
//           <TradersLiveStats />
//         </PanelWrapper>
//       ),
//       layout: { i: 'static-trader-stats', x: 0, y: 0, w: 4, h: 6 },
//     },
//     {
//       id: 'static-coin-stats',
//       component: (
//         <PanelWrapper
//           id="static-coin-stats"
//           title="🪙 Coins Live Stats"
//           isMinimized={panelState['static-coin-stats']?.minimized}
//           onMinimize={() => toggleMinimize('static-coin-stats')}
//           onMaximize={() => maximizePanel('static-coin-stats')}
//           onExport={() => exportPanel('static-coin-stats')}
//         >
//           <CoinsLiveStats />
//         </PanelWrapper>
//       ),
//       layout: { i: 'static-coin-stats', x: 4, y: 0, w: 4, h: 6 },
//     },
//     {
//       id: 'kols_whales_table',
//       component: (
//         <PanelWrapper
//           id="kols_whales_table"
//           title="🪙 Kols Whales"
//           isMinimized={panelState['kols_whales_table']?.minimized}
//           onMinimize={() => toggleMinimize('kols_whales_table')}
//           onMaximize={() => maximizePanel('kols_whales_table')}
//           onExport={() => exportPanel('kols_whales_table')}
//         >
//           <RankTable />
//         </PanelWrapper>
//       ),
//       layout: { i: 'kols_whales_table', x: 8, y: 0, w: 4, h: 8 },
//     },
//   ]

//   const fullLayout = [...staticPanels.map(p => p.layout), ...layouts]

//   return (
//     <div className="h-screen bg-zinc-950 text-white p-2 overflow-hidden">
//       <ReactGridLayout
//       width={gridWidth}
//         isResizable
//         isDraggable
//         useCSSTransforms
//         compactType="vertical"
//         preventCollision={false}
//         className="layout"
//         layout={fullLayout}
//         cols={12}
//         rowHeight={50}
//         draggableCancel=".non-draggable"
//         onLayoutChange={(newLayout) => {
//           updateLayout(newLayout.filter(l => !l.i.startsWith('static-')))
//           persistState()
//         }}
//       >
//         {staticPanels.map(({ id, component }) => (
//           <div key={id} className="bg-zinc-900 rounded shadow-sm border border-zinc-700 p-2">
//             {component}
//           </div>
//         ))}

//         {panels.map(({ id, type, props }) => (
//           <div key={id} className="bg-zinc-900 rounded shadow-sm border border-zinc-700 p-2">
//             <Panel id={id} type={type} {...props} />
//           </div>
//         ))}
//       </ReactGridLayout>
//     </div>
//   )
// }


const statsCards: StatCardProps[] = [
  {
    icon: undefined,
    value: 'Memory Usage',
    label: '100'
  }
]


import { RndPanel } from './RndPanel'
import { useGridStore } from '../store/gridStore'
import { CoinPanelItem } from './CoinPanelItem'
import { TraderPanelItem } from './TraderPanelItem'

import { RankTable } from './RankTable'
import { useEffect } from 'react'
import { StatCard, StatCardProps } from './StatCard'
import { CoinsLiveStats } from './CoinsLiveStats'
import { TradersLiveStats } from './TradersLiveStats'
import { SwapTable } from './tables/SwapTable'
import { TraderSummaryTable } from './tables/TraderSummaryTable'
import { MemecoinTable } from './tables/MemecoinTable'
import { TraderActivityChart } from './charts/TraderActivityChart'
import RankerConfigEditor from './RankerConfigEditor'

const ComponentMap = {
  TradersLiveStats,
  CoinsLiveStats,
  RankTable,
  StatCard,
  SwapTable,
  MemecoinTable,
  TraderActivityChart,RankerConfigEditor,
  TraderSummaryTable// the component itself, not instances
} as const

type PanelType = keyof typeof ComponentMap
export const Dashboard = () => {
  const panels = useGridStore((s) => s.panels)
  const addPanel = useGridStore((state) => state.addPanel)
  const statsCards = [
    {
      id: 'sales-card',
      props: {
        icon: '💰',
        value: '$24,780',
        label: 'Sales',
        trend: '+49%',
        trendColor: 'text-green-500 bg-green-800',
        imageUrl: 'https://placehold.co/300x100/19233c/19233c',
      },
    },
    {
      id: 'users-card',
      props: {
        icon: '👥',
        value: '1,204',
        label: 'Active Users',
        trend: '+12%',
        trendColor: 'text-blue-500 bg-blue-800',
        imageUrl: 'https://placehold.co/300x100/19233c/19233c',
      },
    },
    {
      id: 'conversion-card',
      props: {
        icon: '📈',
        value: '3.7%',
        label: 'Conversion Rate',
        trend: '+0.8%',
        trendColor: 'text-purple-500 bg-purple-800',
        imageUrl: 'https://placehold.co/300x100/19233c/19233c',
      },
    },
  ]

  useEffect(() => {
    if (panels.length === 0) {
      // addPanel({
      //   id: 'rank-table',
      //   type: 'RankTable',
      //   props: {},
      // })
      // addPanel({
      //   id: 'swaps-table',
      //   type: 'SwapTable',
      //   props: {},
      // })
      // addPanel({
      //   id: 'trader-swap-dummy-table',
      //   type: 'TraderSummaryTable',
      //   props: {},
      // })

      // addPanel({
      //   id: 'memcoin-table',
      //   type: 'MemecoinTable',
      //   props: {},
      // })
      // addPanel({
      //   id: 'trader-activity-chart',
      //   type: 'TraderActivityChart',
      //   props: {},
      // })
      addPanel({
        id: 'ranker-config-editor',
        type: 'RankerConfigEditor',
        props: {},
      })


      // addPanel({
      //   id:'TradersLiveStats',type:"TradersLiveStats",props:{}
      // })
      // addPanel({
      //   id:'CoinsLiveStats',type:"CoinsLiveStats",props:{}
      // })

      // statsCards.forEach((card) => {
      //   addPanel({
      //     id: card.id,
      //     type: 'StatCard',
      //     props: card.props,
      //   })
      // })
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-zinc-950 text-white overflow-hidden">
      {panels.map(({ id, type, props }) => {
        const Component = ComponentMap[type as PanelType]
        return (
          <RndPanel key={id} id={id}>
            <Component {...props} />
          </RndPanel>
        )
      })}
    </div>
  )
}
