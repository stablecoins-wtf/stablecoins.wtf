import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin } from '@models/Coin.model'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({coin}) => {
  return <>
    <div tw="flex flex-col overflow-hidden space-y-1">
      <HomeCoinDetailsMain coin={coin} />
      {!!coin.cpNews?.length && <HomeCoinDetailsNewsticker coin={coin} />}
    </div>
  </>
}

export const HomeCoinDetailsMain: FC<HomeCoinDetailsProps> = ({coin}) => {
  return <>
    <BloombergBox tw="flex-1" title={coin.name}>
      {coin.description &&
        <div tw="prose prose-invert">
          <RichText content={coin.description} />
        </div>
      }
      <pre tw="text-xs leading-[1.3] text-bbg-gray1 max-w-full overflow-scroll">
        {JSON.stringify(coin, null, 2)}
      </pre>
    </BloombergBox>
  </>
}

export const HomeCoinDetailsNewsticker: FC<HomeCoinDetailsProps> = ({coin}) => {
  const news = coin.cpNews.slice(0, Math.min(coin.cpNews.length, 5))
  return <>
    <BloombergBox title='Newsticker'>
      <div tw="flex flex-col -mx-2 -mb-2">
        {news.map(n => (
          <Link key={n.id} href={n.url} target='_blank' passHref>
            <a tw="flex justify-between px-1 bg-black cursor-pointer hover:bg-bbg-gray3 text-sm">  
              <div tw="truncate pb-0.5 px-1 text-bbg-orange">
                {n.title}
              </div>
              <div tw="whitespace-nowrap pb-0.5 px-1 text-bbg-gray1">
                {dayjs(n.published_at).format('YYYY/MM/DD hh:mm')}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </BloombergBox>
  </>
}