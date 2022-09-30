import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import { FC } from 'react'
import 'twin.macro'
import { ProseWrapper } from '../ProseWrapper'
import { HomeContentHeader } from './HomeContentHeader'

export interface HomeArticleContentProps {
  article: Article | Resource
}
export const HomeArticleContent: FC<HomeArticleContentProps> = ({ article }) => {
  return (
    <article itemScope itemType="http://schema.org/Article">
      {/* Header */}
      <HomeContentHeader item={article} />

      {/* Body */}
      {article.content && (
        <section itemProp="articleBody">
          <ProseWrapper tw="px-2 py-1">
            <RichText content={article.content} />
          </ProseWrapper>
        </section>
      )}
    </article>
  )
}
