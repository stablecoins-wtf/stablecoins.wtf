import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { ImSpinner8 } from 'react-icons/im'
import { useQuery } from 'react-query'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import 'twin.macro'
import { theme } from 'twin.macro'

const TRADING_DATA_MAX_AGE_MINUTES = 60 * 24

export interface CoinPriceHistoryChartProps {
  coin: Coin
}
export const CoinPriceHistoryChart: FC<CoinPriceHistoryChartProps> = ({coin}) => {
  const query = () => axios.post<{ cgTradingData: CoingeckoTradingData }>(
    '/api/coin/coingecko-trading-data',
    { symbol: coin.symbol, coingeckoId: coin.coingeckoId }
  )
  const { data, isLoading, isError, refetch } = useQuery(['trading-data', coin.id], query, { retry: false, enabled: false })
  const [priceHistory, setPriceHistory] = useState<CoingeckoTradingData>()

  useEffect(() => {
    // Check if price history was fetched
    const cgTradingData = data?.data?.cgTradingData
    if (cgTradingData) {
      setPriceHistory(cgTradingData)
      return
    }
    // Check if price history already exist and/or is outdated
    const updatedAt = coin?.cgTradingData?.updatedAt
    const isOutdated =
    dayjs().diff(updatedAt, 'minute', true) > TRADING_DATA_MAX_AGE_MINUTES
    if (!updatedAt || isOutdated) {
      refetch()
    } else {
      setPriceHistory(coin.cgTradingData)
    }
  }, [data?.data, coin?.symbol])

  const CustomTooltip: FC = ({ payload }: any) => {
    const data = payload?.[0]?.payload
    if (!data) return null
    return <>
      <div tw="flex flex-col items-center">
        <div>${data[1].toFixed(4)}</div>
        <div tw="text-xs text-gray-300">{dayjs(data[0]).format('YYYY/MM/DD')}</div>
      </div>
    </>
  }

  if (isError) return null
  if (!isLoading && !priceHistory?.prices?.length) return null
  
  return <>
    <div tw="relative">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart data={priceHistory?.prices}
          margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3" stroke={theme`colors.bbg.gray2`} />
          <XAxis dataKey="0" stroke='white' tickFormatter={d => d && dayjs(d).format('MM/DD')} fontSize={14} tickMargin={5} />
          <YAxis dataKey="1" stroke='white' tickFormatter={p => `$${p.toFixed(2)}`} fontSize={14} tickMargin={5} domain={[0.9, 1.1]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <ReferenceLine y={1} stroke={theme`colors.bbg.red2`} strokeDasharray="3 3" />
          <Line type="monotone" dataKey="1" name={`${coin.symbol} Price`} r={0} strokeWidth={2} animateNewValues={false} stroke={theme`colors.bbg.cyan`}/>
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