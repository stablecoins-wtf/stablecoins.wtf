import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import { useMergedCgTradingData } from '@shared/useMergedCgTradingData'
import dayjs from 'dayjs'
import { FC } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'
import { AccumulatedCoinsChartsProps } from './AccumulatedCoinsCharts'

export const AccumulatedCoinsMarketCapChart: FC<AccumulatedCoinsChartsProps> = ({ coins }) => {
  const { allDates, allSymbols, allColors, mergedData } = useMergedCgTradingData(coins, 'market_caps')

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
        <AreaChart data={mergedData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="date" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis stroke='white' tickFormatter={p => `$${largeNumberFormatter(p)}`} fontSize={14} tickMargin={5} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} payload={[{value: 'Stablecoin Market Caps'}]} />
          {allSymbols.map((symbol, idx) => (
            <Area key={symbol} type="monotone" dataKey={symbol} name={`${symbol} Market Cap`} stackId="1" stroke={allColors[idx]} fill={allColors[idx]} animateNewValues={false} activeDot={{ r: 2 }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </>
}