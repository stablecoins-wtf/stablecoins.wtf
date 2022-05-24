import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import dayjs from 'dayjs'
import { FC } from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'
import { CoinChartProps } from './CoinCharts'

export const CoinVolumeChart: FC<CoinChartProps> = ({coin, tradingData, isLoading, isError}) => {
  if (isError) return null
  if (!isLoading && !tradingData?.prices?.length) return null

  const CustomTooltip: FC = ({ payload }: any) => {
    const data = payload?.[0]?.payload
    if (!data) return null
    return <>
      <div tw="flex flex-col items-center">
        <div>${largeNumberFormatter(data[1])}</div>
        <div tw="text-xs text-gray-300">{dayjs(data[0]).format('YYYY/MM/DD')}</div>
      </div>
    </>
  }

  return <>
    <div tw="relative col-span-2 md:col-span-1">
      <ResponsiveContainer width="100%" aspect={1.5}>
        <LineChart data={tradingData?.total_volumes} syncId={coin.id} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="0" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis dataKey="1" stroke='white' tickFormatter={p => `$${largeNumberFormatter(p)}`} fontSize={14} tickMargin={5} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="1" name={`${coin.symbol} Volume`} r={0} strokeWidth={2} animateNewValues={false} stroke={theme`colors.bbg.cyan`}/>
        </LineChart>
      </ResponsiveContainer>

      {/* Loading Animation */}
      {isLoading &&
        <div tw="absolute inset-0 flex justify-center items-center">
          <ImSpinner8 size={28} tw="animate-spin mb-10" />
        </div>}
    </div>
  </>
}