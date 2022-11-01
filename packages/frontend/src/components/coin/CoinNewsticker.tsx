import { BloombergBox } from '@components/home/BloombergBox'
import { CryptopanicNews } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import 'twin.macro'
import { CoinDetailsProps } from './CoinDetails'

export const CoinNewsticker: FC<CoinDetailsProps> = ({ coin }) => {
  const query = () =>
    axios.post<{ news: CryptopanicNews[] }>('/api/coin/news', { symbol: coin.symbol, limit: 5 })
  const { data, isLoading, isError } = useQuery(['news', coin.id], query, { retry: false })
  const [news, setNews] = useState<CryptopanicNews[]>([])
  useEffect(() => {
    setNews(data?.data?.news || [])
  }, [data?.data])

  if (isError) return null
  return (
    <>
      <BloombergBox title={`$${coin.symbol} Newsticker`}>
        <div tw="flex flex-col -mx-3 -mb-1">
          {isLoading ? (
            <div tw="px-3 pb-2 text-sm text-bbg-gray1 animate-pulse">Loading...</div>
          ) : (
            news.map((n) => (
              <Link
                key={n.id}
                href={n.url}
                target="_blank"
                tw="flex items-baseline px-2 bg-black cursor-pointer hover:bg-bbg-gray3 text-sm"
              >
                <div tw="grow truncate pb-0.5 px-1 text-bbg-orange">
                  {(n.title || '').trim().replaceAll('\ufe0f', '')}
                </div>
                {n.is_hot && (
                  <div tw="leading-none text-xs text-bbg-red1 font-black tracking-wider uppercase mx-1">
                    HOT
                  </div>
                )}
                <div tw="whitespace-nowrap pb-0.5 px-1 text-bbg-gray2">
                  {dayjs(n.published_at).format('YYYY/MM/DD HH:mm')}
                </div>
              </Link>
            ))
          )}
        </div>
      </BloombergBox>
    </>
  )
}
