import { Coin, CovalentPriceHistory } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { useQuery } from 'react-query'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'

const CV_PRICE_HISTORY_MAX_AGE_MINUTES = 60 * 24

export interface CoinPriceHistoryChartProps {
  coin: Coin
}
export const CoinPriceHistoryChart: FC<CoinPriceHistoryChartProps> = ({coin}) => {
  const query = () => axios.post<{ cvPriceHistory: CovalentPriceHistory }>(
    '/api/coin/price-history',
    { symbol: coin.symbol }
  )
  const { data, isLoading, isError, refetch } = useQuery(['price-history', coin.id], query, { retry: false, enabled: false })
  const [cvPriceHistory, setCvPriceHistory] = useState<CovalentPriceHistory>()

  useEffect(() => {
    // Check if price history was fetched
    const cvPriceHistory = data?.data?.cvPriceHistory
    if (cvPriceHistory) {
      setCvPriceHistory(cvPriceHistory)
      return
    }
    // Check if price history already exist and/or is outdated
    const updatedAt = coin?.cvPriceHistory?.updatedAt
    const isOutdated =
    dayjs().diff(updatedAt, 'minute', true) > CV_PRICE_HISTORY_MAX_AGE_MINUTES
    if (!updatedAt || isOutdated) {
      refetch()
    } else {
      setCvPriceHistory(coin.cvPriceHistory)
    }
  }, [data, coin])

  const CustomTooltip: FC = ({ payload }: any) => {
    const data = payload?.[0]?.payload
    if (!data) return null
    return <>
      <div tw="flex flex-col items-center">
        <div>${data.price.toFixed(4)}</div>
        <div tw="text-xs text-gray-300">{dayjs(data.date).format('YYYY/MM/DD')}</div>
      </div>
    </>
  }

  if (isError) return null
  if (!isLoading && !cvPriceHistory?.prices?.length) return null
  
  return <>
    <div tw="relative">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart data={cvPriceHistory?.prices}
          margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="date" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis dataKey="price" stroke='white' tickFormatter={p => `$${p.toFixed(1)}`} fontSize={14} tickMargin={5} domain={[0.7, 1.3]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Line type="monotone" dataKey="price" name={`${coin.symbol} Price`} r={0} strokeWidth={2} animateNewValues={false} stroke={theme`colors.bbg.cyan`}/>
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