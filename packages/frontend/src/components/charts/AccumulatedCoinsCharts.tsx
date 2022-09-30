import { Coin } from '@models/Coin.model'
import {
  CoingeckoMergedTradingDataPoint,
  useMergedCgTradingData,
} from '@shared/useMergedCgTradingData'
import { FC } from 'react'
import 'twin.macro'
import { AccumulatedCoinsMarketCapChart } from './AccumulatedCoinsMarketCapChart'
import { AccumulatedCoinsVelocityChart } from './AccumulatedCoinsVelocityChart'
import { AccumulatedCoinsVolumeChart } from './AccumulatedCoinsVolumeChart'

export interface AccumulatedCoinsChartProps extends AccumulatedCoinsChartsProps {
  mergedData: CoingeckoMergedTradingDataPoint[]
  allDates: string[]
  allSymbols: string[]
  allColors: string[]
}

export interface AccumulatedCoinsChartsProps {
  coins: Coin[]
}
export const AccumulatedCoinsCharts: FC<AccumulatedCoinsChartsProps> = ({ coins }) => {
  const { allDates, allSymbols, allColors, mergedData } = useMergedCgTradingData(coins)

  return (
    <>
      <div tw="grid grid-cols-2 gap-y-4">
        <h2 tw="sr-only">Stablecoin Market Caps</h2>
        <AccumulatedCoinsMarketCapChart
          coins={coins}
          allDates={allDates}
          allSymbols={allSymbols}
          allColors={allColors}
          mergedData={mergedData['market_caps']}
        />
        <h2 tw="sr-only">Stablecoin Volumes</h2>
        <AccumulatedCoinsVolumeChart
          coins={coins}
          allDates={allDates}
          allSymbols={allSymbols}
          allColors={allColors}
          mergedData={mergedData['total_volumes']}
        />
        <h2 tw="sr-only">Stablecoin Velocity</h2>
        <AccumulatedCoinsVelocityChart
          coins={coins}
          allDates={allDates}
          allSymbols={allSymbols}
          allColors={allColors}
          mergedData={mergedData['velocity']}
        />
      </div>
    </>
  )
}
