import dayjs from 'dayjs'
import { FC } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'
import { AccumulatedCoinsChartProps } from './AccumulatedCoinsCharts'

export const AccumulatedCoinsVelocityChart: FC<AccumulatedCoinsChartProps> = ({ allSymbols, allColors, mergedData }) => {
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
              ]}>{symbol}:</span> {(value as number).toFixed(2)}
              {(idx !== Object.keys(values).length - 1) && ','}
            </div>
          ))}
        </div>
        <div tw="text-xs text-gray-300">{dayjs(date).format('YYYY/MM/DD')}</div>
      </div>
    </>
  }

  return <>
    <div tw="relative col-span-2">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart data={mergedData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="date" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis stroke='white' tickFormatter={p => p.toFixed(1)} fontSize={14} tickMargin={5} domain={[0, 2.2]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} payload={[{value: 'Stablecoin Velocity'}]} />
          {allSymbols.map((symbol, idx) => (
            <Line key={symbol} type="monotone" dataKey={symbol} name={`${symbol} Velocity`} stroke={allColors[idx]} animateNewValues={false} r={0} activeDot={{ r: 1 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </>
}