import { CoinPriceHistoryChart } from '@components/coin/CoinPriceHistoryChart'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin, CryptopanicNews } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({coin}) => {
  return <>
    <div tw="flex flex-col overflow-hidden space-y-1">
      <HomeCoinDetailsMain coin={coin} />
      <HomeCoinDetailsNewsticker coin={coin} />
    </div>
  </>
}

export const HomeCoinDetailsMain: FC<HomeCoinDetailsProps> = ({coin}) => {
  return <>
    <BloombergBox tw="flex-1 flex flex-col" title={coin.name}>

      <CoinPriceHistoryChart coin={coin} />

      <hr tw="opacity-25 my-5" />

      {coin.description &&
        <div className="prose prose-invert max-w-full">
          <RichText content={coin.description} />
        </div>}

      <hr tw="opacity-25 my-5" />

      <details>
        <summary>JSON data available ({coin.symbol})</summary>
        <pre tw="text-xs leading-[1.3] text-bbg-gray1 max-w-full overflow-scroll">
          {JSON.stringify(coin, null, 2)}
        </pre>
      </details>

    </BloombergBox>
  </>
}

export const HomeCoinDetailsNewsticker: FC<HomeCoinDetailsProps> = ({coin}) => {
  const query = () => axios.post<{ news: CryptopanicNews[] }>(
    '/api/coin/news',
    { symbol: coin.symbol, limit: 5 }
  )
  const { data, isLoading, isError } = useQuery(['news', coin.id], query, { retry: false })
  const [news, setNews] = useState<CryptopanicNews[]>([])
  useEffect(() => {
    setNews(data?.data?.news || [])
  }, [data?.data])

  if (isError) return null
  return <>
    <BloombergBox title='Newsticker'>
      <div tw="flex flex-col -mx-2 -mb-2">
        {isLoading ? (
          <div tw="px-2 pb-2 text-sm text-bbg-gray1 animate-pulse">
            Loading...
          </div>
        ) : (
          news.map(n => (
            <Link key={n.id} href={n.url} target='_blank' passHref>
              <a tw="flex px-1 bg-black cursor-pointer hover:bg-bbg-gray3 text-sm">  
                <div tw="flex-grow truncate pb-0.5 px-1 text-bbg-orange">
                  {n.title}
                </div>
                {n.is_hot &&
                  <div tw="flex items-center justify-center mx-1 my-px px-1 bg-bbg-red1 text-white text-xs font-bold tracking-wider">HOT</div>}
                <div tw="whitespace-nowrap pb-0.5 px-1 text-bbg-gray1">
                  {dayjs(n.published_at).format('YYYY/MM/DD hh:mm')}
                </div>
              </a>
            </Link>
          ))
        )}
      </div>
    </BloombergBox>
  </>
}