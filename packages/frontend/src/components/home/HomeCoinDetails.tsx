import { CoinCharts } from '@components/charts/CoinCharts'
import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { ProseWrapper } from '@components/shared/ProseWrapper'
import { sanitizeRichTextContent } from '@components/shared/richtextcontentHelpers'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin, CoinMechanism, CryptopanicNews } from '@models/Coin.model'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import axios from 'axios'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BsInfoCircle } from 'react-icons/bs'
import { NumericFormat } from 'react-number-format'
import { useQuery } from 'react-query'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'
import { HomeContentHeader } from './HomeContentHeader'

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
  const title = `${coin.name}, $${coin.symbol}`
  const subtitle = `USD-pegged Stablecoin`
  const description = sanitizeRichTextContent(coin.description)

  return (
    <>
      <BloombergBox
        tw="flex-1 flex flex-col"
        title={`Last updated at ${dayjs(coin.updatedAt).format('YYYY/MM/DD')}`}
        noHeadingMarkup={true}
      >
        <HomeContentHeader {...{ title, subtitle }} hideTopBar={true} tw="mb-6!" />

        <h2 tw="sr-only">KPIs & Market Data</h2>

        <CoinDetailsKPIs coin={coin} />

        <CoinCharts coin={coin} />

        <CoinDetailsStaticAttributes coin={coin} />

        {coin.description && (
          <ProseWrapper tw="mt-2 max-w-full">
            <h2 tw="sr-only">Description</h2>
            <RichText content={description} />
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
                  <div tw="grow truncate pb-0.5 px-1 text-bbg-orange">{n.title}</div>
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
  const quotes = coin.latestQuotes.USD
  return (
    <>
      <KPIsWrapper>
        {quotes.marketCap && (
          <KPI>
            <KPITitle>Market Cap</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.marketCap.value)}</KPIContent>
          </KPI>
        )}

        {quotes.marketCap7dChange && (
          <KPI>
            <KPITitle>Market Cap 7d %</KPITitle>
            <KPIContent
              css={[quotes.marketCap7dChange.value >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}
            >
              <NumericFormat
                value={Math.abs(quotes.marketCap7dChange.value * 100)}
                displayType={'text'}
                prefix={quotes.marketCap7dChange.value >= 0 ? '+' : '-'}
                suffix={'%'}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </KPIContent>
          </KPI>
        )}

        {quotes.marketCap30dChange && (
          <KPI>
            <KPITitle>Market Cap 30d %</KPITitle>
            <KPIContent
              css={[quotes.marketCap30dChange.value >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}
            >
              <NumericFormat
                value={Math.abs(quotes.marketCap30dChange.value * 100)}
                displayType={'text'}
                prefix={quotes.marketCap30dChange.value >= 0 ? '+' : '-'}
                suffix={'%'}
                decimalScale={2}
                fixedDecimalScale={true}
              />
            </KPIContent>
          </KPI>
        )}

        {quotes.volume24h && (
          <KPI>
            <KPITitle>Volume 24h</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.volume24h.value)}</KPIContent>
          </KPI>
        )}

        {quotes.volume7d && (
          <KPI>
            <KPITitle>Volume 7d</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.volume7d.value)}</KPIContent>
          </KPI>
        )}
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
      <ProseWrapper tw="max-w-full">
        <h2>Further Links</h2>
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
