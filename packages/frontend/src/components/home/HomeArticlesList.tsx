import { Article } from '@models/Article.model'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeArticlesListProps {
  articles: Article[]
}
export const HomeArticlesList: FC<HomeArticlesListProps> = ({ articles, ...props }) => {
  const { query, asPath: path } = useRouter()
  const [activeArticle, setActiveArticle] = useState<Article | undefined>()

  // Update `activeArticle` on path changes
  useEffect(() => {
    const activeArticle = path.startsWith('/articles')
      ? articles?.find((a) => a.slug === query?.slug)
      : undefined
    setActiveArticle(activeArticle)
  }, [path, query?.slug])

  return (
    <>
      <BloombergBox title="Latest Blog Articles" {...props}>
        <div tw="flex flex-col -mx-3 -mb-1">
          {(articles || []).map((a, idx) => (
            <Link key={a.id} href={a.getRelativeUrl()} passHref>
              <a
                css={[
                  tw`flex justify-between px-2 py-0.5 bg-black cursor-pointer text-sm`,
                  activeArticle?.id === a.id
                    ? tw`bg-white text-black`
                    : tw`text-bbg-orange hover:bg-bbg-gray3`,
                ]}
              >
                <div tw="flex pb-0.5 px-1 overflow-hidden">
                  <div tw="whitespace-pre font-semibold">{idx + 1}. </div>
                  <div tw="flex flex-col overflow-hidden">
                    <div tw="truncate font-semibold">{a.title}</div>
                    <div
                      css={[
                        tw`leading-4 text-xs truncate`,
                        activeArticle?.id === a.id ? tw`text-bbg-gray2` : tw`text-bbg-gray1`,
                      ]}
                    >
                      {a.subtitle}
                    </div>
                  </div>
                </div>
                <div tw="pb-0.5 px-1 font-normal text-bbg-gray2">
                  {dayjs(a.createdAt).format('YYYY/MM/DD')}
                </div>
              </a>
            </Link>
          ))}
        </div>
      </BloombergBox>
    </>
  )
}
