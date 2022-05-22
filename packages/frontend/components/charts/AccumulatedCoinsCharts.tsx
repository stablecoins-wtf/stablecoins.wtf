import { Coin } from '@models/Coin.model'
import { CoingeckoMergedTradingDataPoint, useMergedCgTradingData } from '@shared/useMergedCgTradingData'
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
export const AccumulatedCoinsCharts: FC<AccumulatedCoinsChartsProps> = ({coins}) => {
  const { allDates, allSymbols, allColors, mergedData } = useMergedCgTradingData(coins)

  return <>
    <div tw="grid grid-cols-2 gap-y-4">
      <AccumulatedCoinsMarketCapChart coins={coins}
        allDates={allDates} allSymbols={allSymbols} allColors={allColors} mergedData={mergedData['market_caps']} />
      <AccumulatedCoinsVolumeChart coins={coins}
        allDates={allDates} allSymbols={allSymbols} allColors={allColors} mergedData={mergedData['total_volumes']} />
      <AccumulatedCoinsVelocityChart coins={coins}
        allDates={allDates} allSymbols={allSymbols} allColors={allColors} mergedData={mergedData['velocity']} />
    </div>
  </>
}