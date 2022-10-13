import { ProseWrapper } from '@components/shared/ProseWrapper'
import { Coin } from '@models/Coin.model'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import Link from 'next/link'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

export interface ArticleRelatedCoinBoxesProps {
  coins: Coin[]
  fullWidth?: boolean
}
export const ArticleRelatedCoinBoxes: FC<ArticleRelatedCoinBoxesProps> = ({ coins, fullWidth }) => {
  if (!coins?.length) return null
  return (
    <>
      <ProseWrapper>
        <hr />
        <h2>Related Coin Page{coins.length > 1 ? 's' : ''}</h2>
      </ProseWrapper>

      <div
        css={[
          tw`grid -my-2 mb-6`,
          coins.length > 1 && tw`md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2`,
        ]}
      >
        {coins.map((c) => (
          <ArticleRelatedCoinBox key={`related-coin-${c.id}`} coin={c} />
        ))}
      </div>
    </>
  )
}

const CoinBoxDataRow = styled.div(() => [tw`flex justify-between py-1 px-2 text-sm space-x-5`])
const CoinBoxDataKey = styled.div(() => [tw`text-bbg-gray2`])
const CoinBoxDataVal = styled.div(({ highlight }: any) => [
  tw`font-medium`,
  highlight === 'orange' && tw`text-bbg-orange`,
  highlight === 'red' && tw`text-bbg-red1`,
  highlight === 'green' && tw`text-bbg-green1`,
])

export interface ArticleRelatedCoinBoxProps {
  coin: Coin
}
export const ArticleRelatedCoinBox: FC<ArticleRelatedCoinBoxProps> = ({ coin: c }) => {
  const quotes = c.latestQuotes.USD
  const priceHighlight =
    quotes.price && Math.abs(1 - quotes.price.value) > 0.01
      ? Math.abs(1 - quotes.price.value) > 0.05
        ? 'red'
        : 'orange'
      : 'green'
  const marketCap7dHighlight =
    quotes.marketCap7dChange && quotes.marketCap7dChange.value >= 0 ? 'green' : 'red'

  return (
    <>
      <div tw="grow flex mx-2 my-2 bg-bbg-gray3/40 divide-x divide-bbg-gray3 border border-bbg-gray3 overflow-hidden">
        {/* Name, Symbol, and Link */}
        <div tw="grow [flex-basis: 40%] flex flex-col items-center justify-center mx-4 my-2 text-center whitespace-nowrap">
          <div tw="text-bbg-gray2 text-sm">{c.name}</div>
          <h3 tw="text-2xl font-medium text-bbg-orange tracking-wide">${c.symbol}</h3>
          <Link href={`/coins/${c.slug}`} passHref>
            <a tw="text-sm font-bold mt-3 text-bbg-gray1 hover:(text-white underline)">
              Full coin details →
            </a>
          </Link>
        </div>

        {/* KPIs & Metadata */}
        <div tw="grow [flex-basis: 60%] flex flex-col divide-y divide-bbg-gray3 whitespace-nowrap">
          {!!c.mechanism && (
            <CoinBoxDataRow>
              <CoinBoxDataKey>Mechanism</CoinBoxDataKey>
              <CoinBoxDataVal>{c.mechanismFormatted()}</CoinBoxDataVal>
            </CoinBoxDataRow>
          )}
          {quotes.price && (
            <CoinBoxDataRow>
              <CoinBoxDataKey>Price</CoinBoxDataKey>
              <CoinBoxDataVal highlight={priceHighlight}>
                <NumericFormat
                  value={quotes.price.value}
                  displayType={'text'}
                  prefix={'$'}
                  fixedDecimalScale={true}
                  decimalScale={3}
                />
              </CoinBoxDataVal>
            </CoinBoxDataRow>
          )}
          {quotes.marketCap && (
            <CoinBoxDataRow>
              <CoinBoxDataKey>Market Cap</CoinBoxDataKey>
              <CoinBoxDataVal>${largeNumberFormatter(quotes.marketCap.value)}</CoinBoxDataVal>
            </CoinBoxDataRow>
          )}
          {quotes.marketCap7dChange && (
            <CoinBoxDataRow>
              <CoinBoxDataKey>Market Cap 7d</CoinBoxDataKey>
              <CoinBoxDataVal highlight={marketCap7dHighlight}>
                <NumericFormat
                  value={Math.abs(quotes.marketCap7dChange.value * 100)}
                  displayType={'text'}
                  prefix={quotes.marketCap7dChange.value >= 0 ? '+' : '-'}
                  suffix={'%'}
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </CoinBoxDataVal>
            </CoinBoxDataRow>
          )}
        </div>
      </div>
    </>
  )
}
