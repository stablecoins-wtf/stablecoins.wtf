import { Coin } from '@models/Coin.model'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { theme } from 'twin.macro'

export interface CoingeckoMergedTradingDataPoint {
  date: string,
  [coinSymbol: string]: any,
}

export type CoingeckoTradingDataKey = 'market_caps' | 'total_volumes' | 'prices'

export const useMergedCgTradingData = (coins: Coin[], key: CoingeckoTradingDataKey) => {
  const [allDates, setAllDates] = useState<string[]>([])
  const [allSymbols, setAllSymbols] = useState<string[]>([])
  const [allColors, setAllColors] = useState<string[]>([])
  const [mergedData, setMergedData] = useState<CoingeckoMergedTradingDataPoint[]>()
    
  // const [coinsWithTradingData, setCoinsWithTradingData] = useState<Coin[]>([])
  // useEffect(() => {
  //   // Determining all coins that have cgTradingData attached
  //   const coinsWithTradingData = (coins || [])
  //     .filter(c => !!c.cgTradingData?.prices?.length)
  //   setCoinsWithTradingData(coinsWithTradingData)
  // }, [coins])

  // Returns true, if given dates are on the same day
  const datesAreSameDay = (d1: any, d2: any): boolean => {
    return dayjs(d1).format('YYYY-MM-DD') === dayjs(d2).format('YYYY-MM-DD')
  }
  
  useEffect(() => {
    // Determine all unique dates (days) with data-points
    const allDates: string[] = Array.from(new Set(
      coins.reduce((acc, val): any => {
        const dataPoints = val?.cgTradingData?.[key] || []
        return [
          ...acc,
          ...dataPoints.map(x => dayjs(x[0]).format('YYYY-MM-DD')),
        ]
      }, [])
    )).sort()
    // Merge data of given key
    const mergedData = allDates
      .map(date => {
        const mergedDataPoint = coins.reduce((acc, val): any => {
          const firstValueForDate = (val?.cgTradingData?.[key] || [])
            .find(x => datesAreSameDay(x[0], date))
          return {
            ...acc,
            ...(firstValueForDate ? {
              [val.symbol]: firstValueForDate[1]
            } : {})
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