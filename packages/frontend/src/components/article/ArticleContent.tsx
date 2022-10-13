import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import { FC } from 'react'
import 'twin.macro'
import { HomeContentHeader } from '../home/HomeContentHeader'
import { ProseWrapper } from '../shared/ProseWrapper'
import { ArticleRelatedCoinBoxes } from './ArticleRelatedCoinBoxes'

export interface ArticleContentProps {
  item: Article | Resource
}
export const ArticleContent: FC<ArticleContentProps> = ({ item }) => {
  const { title, subtitle, updatedAt, tags } = item

  return (
    <article itemScope itemType="http://schema.org/Article">
      {/* Header */}
      <HomeContentHeader {...{ title, subtitle, updatedAt, tags }} />

      {/* Body */}
      {item.content && (
        <section itemProp="articleBody">
          <ProseWrapper>
            <RichText content={item.content} />
          </ProseWrapper>
        </section>
      )}

      {/* Related Coins */}
      <ArticleRelatedCoinBoxes coins={item.relatedCoins} />
    </article>
  )
}
