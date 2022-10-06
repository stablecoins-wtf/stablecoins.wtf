import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import { FC } from 'react'
import 'twin.macro'
import { ProseWrapper } from '../ProseWrapper'
import { HomeContentHeader } from './HomeContentHeader'

export interface HomeArticleContentProps {
  item: Article | Resource
}
export const HomeArticleContent: FC<HomeArticleContentProps> = ({ item }) => {
  return (
    <article itemScope itemType="http://schema.org/Article">
      {/* Header */}
      <HomeContentHeader {...item} />

      {/* Body */}
      {item.content && (
        <section itemProp="articleBody">
          <ProseWrapper>
            <RichText content={item.content} />
          </ProseWrapper>
        </section>
      )}
    </article>
  )
}
