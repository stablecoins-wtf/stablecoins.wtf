import { ProseWrapper } from '@components/shared/ProseWrapper'
import { Coin } from '@models/Coin.model'
import Link from 'next/link'
import { FC } from 'react'
import { RiArticleLine } from 'react-icons/ri'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const ArticleLinkBox = styled
  .a(() => [
    tw`grow max-w-[40rem] flex mx-2 my-2 bg-bbg-gray3/40 border border-bbg-gray3 overflow-hidden cursor-pointer no-underline`,
  ])
  .withComponent(Link)

export interface CoinRelatedArticlesProps {
  coin: Coin
}
export const CoinRelatedArticles: FC<CoinRelatedArticlesProps> = ({ coin }) => {
  const articles = coin.relatedArticles
  if (!articles.length) return null

  return (
    <>
      <ProseWrapper tw="max-w-full">
        <h2>Related Article{articles.length > 1 ? 's' : ''}</h2>

        <div
          css={[
            tw`grid -my-2 -mx-2 mb-3`,
            articles.length > 1 && tw`md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2`,
          ]}
        >
          {articles.map((a) => (
            <ArticleLinkBox
              href={a.getRelativeUrl()}
              key={`related-article-${a.id}`}
              className="group"
            >
              <div tw="grow flex items-center overflow-hidden px-4 py-2 group-hover:(bg-white/5)">
                <RiArticleLine tw="shrink-0 grow-0 h-5 w-5 mr-4 text-white/20 group-hover:(text-white/30)" />
                <div tw="flex flex-col overflow-hidden">
                  <div tw="text-lg text-bbg-orange underline-offset-2 group-hover:(underline)">
                    {a.title} →
                  </div>
                  <div tw="text-sm text-bbg-gray2 truncate">{a.subtitle}</div>
                </div>
              </div>
            </ArticleLinkBox>
          ))}
        </div>
      </ProseWrapper>
    </>
  )
}
