import { Article, ArticleType } from '@models/Article.model'
import { env } from '@shared/environment'
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

  // Sort articles by creation
  const [sortedArticles, setSortedArticles] = useState<Article[]>([])
  useEffect(() => {
    const sortedArticles = [...(articles || [])]
    sortedArticles.sort((a1, a2) => {
      const a1CreatedAt = dayjs(a1.createdAtOverwrite || a1.createdAt)
      const a2CreatedAt = dayjs(a2.createdAtOverwrite || a2.createdAt)
      return a2CreatedAt.diff(a1CreatedAt)
    })
    setSortedArticles(sortedArticles)
  }, [articles])

  // Update `activeArticle` on path changes
  const [activeArticle, setActiveArticle] = useState<Article | undefined>()
  useEffect(() => {
    const basePath = Article.getArticleTypeBasePath(ArticleType.Article)
    const activeArticle = path.startsWith(basePath)
      ? articles?.find((a) => a.slug === query?.slug)
      : undefined
    setActiveArticle(activeArticle)
  }, [path, query?.slug])

  return (
    <>
      <BloombergBox title="Latest Blog Articles" {...props}>
        <div tw="flex flex-col -mx-3 -mb-1">
          {sortedArticles.map((a, idx) => {
            const createdAt = a.createdAtOverwrite || a.createdAt
            const isNew = dayjs().diff(createdAt, 'day') < 7
            const isUpdated = dayjs().diff(a.updatedAt, 'day') < 5

            return (
              <Link
                key={a.id}
                href={a.getRelativeUrl()}
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
                    <div tw="truncate font-semibold">
                      {a.title}
                      {!env.isProduction && a.isDraft && ' 🏗️'}
                    </div>
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
                <div tw="pb-0.5 px-1 text-bbg-gray2">
                  <div tw="flex flex-col items-end">
                    {dayjs(createdAt).format('YYYY/MM/DD')}
                    {(isNew || isUpdated) && (
                      <div tw="leading-none text-xs text-bbg-red1 font-black tracking-wider uppercase">
                        {isNew ? 'NEW' : 'UPDATED'}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </BloombergBox>
    </>
  )
}
