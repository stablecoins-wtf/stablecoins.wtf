import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'
import { AccumulatedCoinsChartsProps } from './AccumulatedCoinsCharts'

export interface CoingeckoMergedTradingDataPoint {
  date: string,
  [coinSymbol: string]: any,
}
export const AccumulatedCoinsMarketCapChart: FC<AccumulatedCoinsChartsProps> = ({ coins }) => {
  const [allDates, setAllDates] = useState<string[]>([])
  const [allSymbols, setAllSymbols] = useState<string[]>([])
  const [allColors, setAllColors] = useState<string[]>([])
  const [mergedData, setMergedData] = useState<CoingeckoMergedTradingDataPoint[]>()

  useEffect(() => {
    const datesAreSameDay = (d1: any, d2: any): boolean => {
      return dayjs(d1).format('YYYY-MM-DD') === dayjs(d2).format('YYYY-MM-DD')
    }
    const allDates: string[] = Array.from(new Set(
      coins.reduce((acc, val): any => {
        const marketCaps = val?.cgTradingData?.market_caps || []
        return [
          ...acc,
          ...marketCaps.map(x => dayjs(x[0]).format('YYYY-MM-DD')),
        ]
      }, [])
    )).sort()
    const mergedData = allDates
      .map(date => {
        const mergedDataPoint = coins.reduce((acc, val): any => {
          const firstMarketCapForDate = (val?.cgTradingData?.market_caps || [])
            .find(x => datesAreSameDay(x[0], date))
          return {
            ...acc,
            ...(firstMarketCapForDate ? {
              [val.symbol]: firstMarketCapForDate[1]
            } : {})
          }
        }, {date})
        return Object.values(mergedDataPoint).length > 2 ? mergedDataPoint : null
      })
      .filter(Boolean) as CoingeckoMergedTradingDataPoint[]
    const allSymbols = Array.from(new Set(
      mergedData.reduce((acc, {date, ...rest}): any => {
        const symbols = Object.keys(rest) || []
        return [ ...acc, ...symbols ]
      }, [])
    ))
    const allColors = allSymbols
      .map(s => coins.find(c => c.symbol === s)?.color || theme`colors.bbg.cyan`)

    setMergedData(mergedData)
    setAllDates(allDates)
    setAllSymbols(allSymbols)
    setAllColors(allColors)
  }, [coins])

  const CustomTooltip: FC = ({ payload }: any) => {
    const data = payload?.[0]?.payload
    if (!data) return null
    const {date, ...values} = data
    return <>
      <div tw="flex flex-col items-center max-w-prose">
        <div tw="text-sm flex flex-wrap space-x-2 justify-center">
          {Object.entries(values).map(([symbol, value], idx) => (
            <div key={symbol}>
              <span css={[
                `color: ${allColors[idx]}`
              ]}>{symbol}:</span> {largeNumberFormatter(value as number)}
              {(idx !== Object.keys(values).length - 1) && ','}
            </div>
          ))}
        </div>
        <div tw="text-xs text-gray-300">{dayjs(date).format('YYYY/MM/DD')}</div>
      </div>
    </>
  }

  return <>
    <div tw="relative">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <AreaChart data={mergedData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="date" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis stroke='white' tickFormatter={p => `$${largeNumberFormatter(p)}`} fontSize={14} tickMargin={5} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} payload={[{value: 'Stablecoin Market Caps'}]} />
          {allSymbols.map((symbol, idx) => (
            <Area key={symbol} type="monotone" dataKey={symbol} name={`${symbol} Market Cap`} stackId="1" stroke={allColors[idx]} fill={allColors[idx]} />
          ))}

        </AreaChart>
      </ResponsiveContainer>
    </div>
  </>
}