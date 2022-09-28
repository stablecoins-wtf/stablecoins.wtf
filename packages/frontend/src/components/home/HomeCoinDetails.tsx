import { CoinCharts } from '@components/charts/CoinCharts'
import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { ProseWrapper } from '@components/ProseWrapper'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin, CoinMechanism, CryptopanicNews } from '@models/Coin.model'
import { datesAreSameDay } from '@shared/datesAreSameDay'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import axios from 'axios'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BsInfoCircle } from 'react-icons/bs'
import NumberFormat from 'react-number-format'
import { useQuery } from 'react-query'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({ coin }) => {
  return (
    <>
      <div tw="flex flex-col overflow-hidden space-y-1">
        <HomeCoinDetailsMain coin={coin} />
        <CoinDetailsNewsticker coin={coin} />
      </div>
    </>
  )
}

export const HomeCoinDetailsMain: FC<HomeCoinDetailsProps> = ({ coin }) => {
  return (
    <>
      <BloombergBox tw="flex-1 flex flex-col" title={coin.name}>
        <h3 tw="text-center mb-4">${coin.symbol} KPIs & Market Data</h3>

        <CoinDetailsKPIs coin={coin} />

        <CoinCharts coin={coin} />

        <CoinDetailsStaticAttributes coin={coin} />

        {coin.description && (
          <ProseWrapper>
            <RichText content={coin.description} />
          </ProseWrapper>
        )}

        <CoinDetailsLinks coin={coin} />
      </BloombergBox>
    </>
  )
}

export const CoinDetailsNewsticker: FC<HomeCoinDetailsProps> = ({ coin }) => {
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
              <Link key={n.id} href={n.url} target="_blank" passHref>
                <a tw="flex px-2 bg-black cursor-pointer hover:bg-bbg-gray3 text-sm">
                  <div tw="flex-grow truncate pb-0.5 px-1 text-bbg-orange">{n.title}</div>
                  {n.is_hot && (
                    <div tw="flex items-center justify-center mx-1 my-px px-1 bg-bbg-red1 text-white text-xs font-bold tracking-wider">
                      HOT
                    </div>
                  )}
                  <div tw="whitespace-nowrap pb-0.5 px-1 text-bbg-gray2">
                    {dayjs(n.published_at).format('YYYY/MM/DD hh:mm')}
                  </div>
                </a>
              </Link>
            ))
          )}
        </div>
      </BloombergBox>
    </>
  )
}

export const CoinDetailsKPIs: FC<HomeCoinDetailsProps> = ({ coin }) => {
  const caps = coin.cgTradingData?.market_caps || []
  const cap = caps?.[caps.length - 1][1]
  let cap7dAgo = 0
  let cap30dAgo = 0
  for (let i = caps.length - 1; i >= 0; i--) {
    const is7dAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(7, 'day'))
    const is30dAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(30, 'day'))
    if (is7dAgo) cap7dAgo = caps[i]?.[1]
    if (is30dAgo) {
      cap30dAgo = caps[i]?.[1]
      break
    }
  }
  const cap7dChange = (cap - (cap7dAgo || 0)) / (cap7dAgo || 1)
  const cap30dChange = (cap - (cap30dAgo || 0)) / (cap30dAgo || 1)
  const volume24h = coin.cmcLatestQuotes?.quote?.USD?.volume_24h
  let volume7d = 0
  const volumes = coin.cgTradingData?.total_volumes || []
  for (let i = volumes.length - 1; i >= 0; i--) {
    if (dayjs().diff(volumes[i]?.[0], 'day') > 7) break
    volume7d += volumes[i]?.[1]
  }

  return (
    <>
      <KPIsWrapper>
        <KPI>
          <KPITitle>Market Cap</KPITitle>
          <KPIContent>${largeNumberFormatter(cap)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 7d %</KPITitle>
          <KPIContent css={[cap7dChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}>
            <NumberFormat
              value={Math.abs(cap7dChange * 100)}
              displayType={'text'}
              prefix={cap7dChange >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 30d %</KPITitle>
          <KPIContent css={[cap30dChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}>
            <NumberFormat
              value={Math.abs(cap30dChange * 100)}
              displayType={'text'}
              prefix={cap30dChange >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 24h</KPITitle>
          <KPIContent>${largeNumberFormatter(volume24h)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 7d</KPITitle>
          <KPIContent>${largeNumberFormatter(volume7d)}</KPIContent>
        </KPI>
      </KPIsWrapper>
    </>
  )
}

export const CoinDetailsStaticAttributes: FC<HomeCoinDetailsProps> = ({ coin }) => {
  const mechanismLinks: { [key in CoinMechanism]?: string } = {
    [CoinMechanism.ALGORITHMIC]: '/resources/algorithmic-stablecoins',
    [CoinMechanism.FIAT_BACKED]: '/resources/fiat-backed-stablecoins',
    [CoinMechanism.CRYPTO_BACKED]: '/resources/crypto-backed-stablecoins',
  }
  const mechanismLink = mechanismLinks[coin.mechanism]

  return (
    <>
      <KPIsWrapper>
        <KPI>
          <KPITitle>Mechanism</KPITitle>
          <KPIContent>
            {mechanismLink ? (
              <Link href={mechanismLink} passHref>
                <a tw="flex items-center underline cursor-pointer">
                  <span>{coin.mechanismFormatted()}</span>
                  <BsInfoCircle tw="ml-2 -translate-y-px" />
                </a>
              </Link>
            ) : (
              coin.mechanismFormatted()
            )}
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Governance</KPITitle>
          <KPIContent>{coin.governance}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Issuer</KPITitle>
          <KPIContent>{coin.issuer}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Jurisdiction</KPITitle>
          <KPIContent>{coin.jurisdiction}</KPIContent>
        </KPI>
      </KPIsWrapper>
    </>
  )
}

export const CoinDetailsLinks: FC<HomeCoinDetailsProps> = ({ coin }) => {
  const metaUrls = coin?.cmcMetadata?.urls || {}
  const links = {
    Website: metaUrls.website?.[0],
    Twitter: metaUrls.twitter?.[0],
    Reddit: metaUrls.reddit?.[0],
    Documentation: metaUrls.technical_doc?.[0],
    'Source Code': metaUrls.source_code?.[0],
  }
  const hasAnyLink = !!Object.values(links).filter(Boolean).length
  if (!hasAnyLink) return null

  return (
    <>
      <ProseWrapper>
        <h4 tw="mt-1.5">Links:</h4>
        <ul>
          {Object.entries(links).map(([title, url]) =>
            url ? (
              <li key={url}>
                {title}:{' '}
                <Link href={url} target="_blank">
                  <a tw="break-words">{url}</a>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </ProseWrapper>
    </>
  )
}
