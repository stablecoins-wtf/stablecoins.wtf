import { Coin } from '@models/Coin.model'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { theme } from 'twin.macro'
import { datesAreSameDay } from './datesAreSameDay'

export interface CoingeckoMergedTradingDataPoint {
  date: string;
  [coinSymbol: string]: any;
}

export type CoingeckoTradingDataKey =
  | 'market_caps'
  | 'total_volumes'
  | 'velocity';

export type CoingeckoMergedTradingDataSets = {
  [set in CoingeckoTradingDataKey]: CoingeckoMergedTradingDataPoint[];
};

export const useMergedCgTradingData = (
  coins: Coin[],
  maxAgeDays: number = 30
) => {
  const [allDates, setAllDates] = useState<string[]>([])
  const [allSymbols, setAllSymbols] = useState<string[]>([])
  const [allColors, setAllColors] = useState<string[]>([])
  const [mergedData, setMergedData] = useState<CoingeckoMergedTradingDataSets>({
    market_caps: [],
    total_volumes: [],
    velocity: [],
  })

  useEffect(() => {
    // Determine all unique dates (days) with data-points
    const maxTimestamp = new Date().getTime() - maxAgeDays * 86400 * 1000
    const allDates: string[] = coins
      .reduce((acc, val): any => {
        const marketCapDataPoints = val?.cgTradingData?.['market_caps'] || []
        const volumeDataPoints = val?.cgTradingData?.['total_volumes'] || []
        if (val?.symbol === 'USDC')console.log(volumeDataPoints)
        return Array.from(
          new Set([
            ...acc,
            ...marketCapDataPoints
              .filter((x) => parseInt(x[0]) > maxTimestamp)
              .map((x) => dayjs(x[0]).format('YYYY-MM-DD')),
            ...volumeDataPoints
              .filter((x) => parseInt(x[0]) > maxTimestamp)
              .map((x) => dayjs(x[0]).format('YYYY-MM-DD')),
          ])
        )
      }, [])
      .sort()

    // Merge data of given key
    const mergedData: CoingeckoMergedTradingDataSets = {
      market_caps: [],
      total_volumes: [],
      velocity: [],
    }
    for (const date of allDates) {
      for (const coin of coins) {
        let firstMarketCapValueForDate = (
          coin.cgTradingData?.['market_caps'] || []
        ).find((x) => datesAreSameDay(x[0], date))
        let firstVolumeValueForDate = (
          coin.cgTradingData?.['total_volumes'] || []
        ).find((x) => datesAreSameDay(x[0], date))
        if (firstMarketCapValueForDate) {
          const doesExist =
            mergedData['market_caps']?.[mergedData['market_caps'].length - 1]
              ?.date === date
          doesExist
            ? (mergedData['market_caps'][mergedData['market_caps'].length - 1][
              coin.symbol
            ] = firstMarketCapValueForDate[1])
            : mergedData['market_caps'].push({
              date,
              [coin.symbol]: firstMarketCapValueForDate[1],
            })
        }
        if (firstVolumeValueForDate) {
          const doesExist =
            mergedData['total_volumes']?.[
              mergedData['total_volumes'].length - 1
            ]?.date === date
          doesExist
            ? (mergedData['total_volumes'][
              mergedData['total_volumes'].length - 1
            ][coin.symbol] = firstVolumeValueForDate[1])
            : mergedData['total_volumes'].push({
              date,
              [coin.symbol]: firstVolumeValueForDate[1],
            })
        }
        if (firstMarketCapValueForDate && firstVolumeValueForDate) {
          const velocity =
            firstVolumeValueForDate[1] / firstMarketCapValueForDate[1]
          const doesExist =
            mergedData['velocity']?.[mergedData['velocity'].length - 1]
              ?.date === date
          doesExist
            ? (mergedData['velocity'][mergedData['velocity'].length - 1][
              coin.symbol
            ] = velocity)
            : mergedData['velocity'].push({ date, [coin.symbol]: velocity })
        }
      }
    }

    // Extracts all symbols from mergedData (there could be coins that have no data at this point)
    const allSymbols = Array.from(
      new Set(
        mergedData['market_caps'].reduce((acc, { date, ...rest }): any => {
          const symbols = Object.keys(rest) || []
          return [...acc, ...symbols]
        }, [])
      )
    )

    // Determine graph colors
    const allColors = allSymbols.map(
      (s) => coins.find((c) => c.symbol === s)?.color || theme`colors.bbg.cyan`
    )

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
