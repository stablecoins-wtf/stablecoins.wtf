import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import { FC } from 'react'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import tw from 'twin.macro'
import { CoinDetailsProps } from './CoinDetails'

export const CoinMarketDataKPIs: FC<CoinDetailsProps> = ({ coin }) => {
  const quotes = coin.latestQuotes.USD

  return (
    <>
      <KPIsWrapper>
        {quotes.marketCap && (
          <KPI>
            <h3 tw="sr-only">Market Cap</h3>
            <KPITitle>Market Cap</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.marketCap.value)}</KPIContent>
          </KPI>
        )}

        {quotes.marketCap7dChange && (
          <KPI>
            <h3 tw="sr-only">7-day Relative Change of Market Cap in %</h3>
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
            <h3 tw="sr-only">30-day Relative Change of Market Cap in %</h3>
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
            <h3 tw="sr-only">24-hour Volume</h3>
            <KPITitle>Volume 24h</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.volume24h.value)}</KPIContent>
          </KPI>
        )}

        {quotes.volume7d && (
          <KPI>
            <h3 tw="sr-only">7-day Volume</h3>
            <KPITitle>Volume 7d</KPITitle>
            <KPIContent>${largeNumberFormatter(quotes.volume7d.value)}</KPIContent>
          </KPI>
        )}
      </KPIsWrapper>
    </>
  )
}
