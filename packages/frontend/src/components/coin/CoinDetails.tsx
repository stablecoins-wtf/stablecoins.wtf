import { CoinCharts } from '@components/charts/CoinCharts'
import { BloombergBox } from '@components/home/BloombergBox'
import { HomeContentHeader } from '@components/home/HomeContentHeader'
import { ProseWrapper } from '@components/shared/ProseWrapper'
import { sanitizeRichTextContent } from '@components/shared/richtextcontentHelpers'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin } from '@models/Coin.model'
import dayjs from 'dayjs'
import { FC } from 'react'
import 'twin.macro'
import { CoinFurtherLinks } from './CoinFurtherLinks'
import { CoinMarketDataKPIs } from './CoinMarketDataKPIs'
import { CoinMetadataAndLegal } from './CoinMetadataAndLegal'
import { CoinNewsticker } from './CoinNewsticker'
import { CoinRelatedArticles } from './CoinRelatedArticles'

export interface CoinDetailsProps {
  coin: Coin
}
export const CoinDetails: FC<CoinDetailsProps> = ({ coin }) => {
  const title = `${coin.name}, $${coin.symbol}`
  const subtitle = `USD-pegged Stablecoin`
  const description = sanitizeRichTextContent(coin.description)

  return (
    <>
      <div tw="flex flex-col overflow-hidden space-y-1">
        <BloombergBox
          tw="flex-1 flex flex-col lg:overflow-y-scroll"
          title={`Metadata last updated at ${dayjs(coin.updatedAt).format('YYYY/MM/DD')}`}
          noHeadingMarkup={true}
          noStickyTopBar={true}
        >
          <HomeContentHeader
            {...{ title, subtitle }}
            sharePrefix="All Stablecoin Details 🪙"
            hideTopBar={true}
            tw="mb-6!"
          />

          <h2 tw="sr-only">Market Data KPIs</h2>
          <CoinMarketDataKPIs coin={coin} />

          <h2 tw="sr-only">Historical Charts</h2>
          <CoinCharts coin={coin} />

          <h2 tw="sr-only">Metadata & Legal Information</h2>
          <CoinMetadataAndLegal coin={coin} />

          {coin.description && (
            <ProseWrapper tw="mt-2 max-w-full">
              <h2 tw="sr-only">Description</h2>
              <RichText content={description} />
            </ProseWrapper>
          )}

          <CoinRelatedArticles coin={coin} />

          <CoinFurtherLinks coin={coin} />
        </BloombergBox>

        {/* Newsticker */}
        <CoinNewsticker coin={coin} />
      </div>
    </>
  )
}
