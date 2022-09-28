import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import dayjs from 'dayjs'
import { FC } from 'react'
import 'twin.macro'
import { ProseWrapper } from '../ProseWrapper'

export interface HomeArticleContentProps {
  article: Article | Resource
}
export const HomeArticleContent: FC<HomeArticleContentProps> = ({ article }) => {
  const tags = (article as Article).tags || []

  return (
    <>
      {/* Header */}
      <div tw="-mx-3 divide-y divide-bbg-gray3 border-y border-bbg-gray3">
        {/* Tags & Date */}
        <div tw="px-3 py-2 flex justify-between">
          <p tw="text-bbg-gray2 text-sm whitespace-nowrap">
            <span tw="hidden md:inline whitespace-pre">Last updated at </span>
            {dayjs(article.updatedAt).format('YYYY/MM/DD hh:mm')}
          </p>
          {!!tags.length && (
            <div tw="flex flex-wrap -mx-1 -my-0.5 ml-2 justify-end">
              {tags.map((tag) => (
                <div key={tag} tw="mx-1 my-0.5 text-bbg-gray1 text-sm tracking-wide uppercase">
                  #{tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div tw="px-3 pt-4 pb-4">
          <div tw="flex flex-col text-center">
            <h1 tw="text-2xl tracking-tight font-bold">{article.title}</h1>
            {article.subtitle && <p tw="text-bbg-gray2 mt-0.5">{article.subtitle}</p>}
          </div>
        </div>
      </div>

      {/* Body */}
      {article.content && (
        <ProseWrapper tw="px-2 py-1">
          <RichText content={article.content} />
        </ProseWrapper>
      )}
    </>
  )
}
