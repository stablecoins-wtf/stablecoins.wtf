import { Coin } from '@models/Coin.model'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { theme } from 'twin.macro'
import { datesAreSameDay } from './datesAreSameDay'

export interface CoingeckoMergedTradingDataPoint {
  date: string,
  [coinSymbol: string]: any,
}

export type CoingeckoTradingDataKey = 'market_caps' | 'total_volumes' | 'velocity'

// TODO 
// Improve performance by calling `useMergedCgTradingData` only once in AccumulatedCoinsCharts
// and export all sets (for market_caps, volume, velocity) at once
export type CoingeckoMergedTradingDataSets = {
  [set in CoingeckoTradingDataKey]: Array<CoingeckoMergedTradingDataPoint>
}
  
export const useMergedCgTradingData = (coins: Coin[], key: CoingeckoTradingDataKey, maxAgeDays: number = 30) => {
  const [allDates, setAllDates] = useState<string[]>([])
  const [allSymbols, setAllSymbols] = useState<string[]>([])
  const [allColors, setAllColors] = useState<string[]>([])
  const [mergedData, setMergedData] = useState<CoingeckoMergedTradingDataPoint[]>()

  useEffect(() => {
    const isVelocity = key === 'velocity'
    // Determine all unique dates (days) with data-points
    const allDates: string[] = Array.from(new Set(
      coins.reduce((acc, val): any => {
        const lookupKey = isVelocity ? 'total_volumes' : key
        const dataPoints = val?.cgTradingData?.[lookupKey] || []
        return [
          ...acc,
          ...dataPoints
            .filter(x => !maxAgeDays || dayjs().diff(x[0], 'day') <= maxAgeDays)
            .map(x => dayjs(x[0]).format('YYYY-MM-DD'))
        ]
      }, [])
    )).sort()
    // Merge data of given key
    const mergedData = allDates
      .map(date => {
        const mergedDataPoint = coins.reduce((acc, val): any => {
          const lookupKey = isVelocity ? 'total_volumes' : key
          let firstValueForDate = (val?.cgTradingData?.[lookupKey] || [])
            .find(x => datesAreSameDay(x[0], date))
          let firstMarketCapValueForDate = (val?.cgTradingData?.['market_caps'] || [])
            .find(x => datesAreSameDay(x[0], date))
          
          return {
            ...acc,
            ...(isVelocity
              ? (firstValueForDate && firstMarketCapValueForDate) ? {
                [val.symbol]: firstValueForDate[1] / firstMarketCapValueForDate[1]
              } : {}
              : firstValueForDate ? {
                [val.symbol]: firstValueForDate[1]
              } : {}),
          }
        }, {date})
        return Object.values(mergedDataPoint).length > 2 ? mergedDataPoint : null
      })
      .filter(Boolean) as CoingeckoMergedTradingDataPoint[]
    // Extracts all symbols from mergedData (there could be coins that have no data at this point)
    const allSymbols = Array.from(new Set(
      mergedData.reduce((acc, {date, ...rest}): any => {
        const symbols = Object.keys(rest) || []
        return [ ...acc, ...symbols ]
      }, [])
    ))
    // Determine graph colors
    const allColors = allSymbols
      .map(s => coins.find(c => c.symbol === s)?.color || theme`colors.bbg.cyan`)

    setMergedData(mergedData)
    setAllDates(allDates)
    setAllSymbols(allSymbols)
    setAllColors(allColors)
  }, [coins])

  return {
    allDates,
    allSymbols,
    allColors,
    mergedData,
  }
}