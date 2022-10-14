import {
  generateRichTextContentTOC,
  sanitizeRichTextContent,
} from '@components/shared/richtextcontentHelpers'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import { HomeContentHeader } from '../home/HomeContentHeader'
import { ProseWrapper } from '../shared/ProseWrapper'
import { ArticleRelatedCoinBoxes } from './ArticleRelatedCoinBoxes'

export interface ArticleContentProps {
  item: Article | Resource
}
export const ArticleContent: FC<ArticleContentProps> = ({ item }) => {
  const { title, subtitle, updatedAt, tags } = item
  const [content, setContent] = useState(item.content || [])
  useEffect(() => {
    let newContent = sanitizeRichTextContent(item.content)
    newContent = generateRichTextContentTOC(item.content)
    setContent(newContent)
  }, [item.content])

  return (
    <article itemScope itemType="http://schema.org/Article">
      {/* Header */}
      <HomeContentHeader {...{ title, subtitle, updatedAt, tags }} />

      {/* Body */}
      {item.content && (
        <section itemProp="articleBody">
          <ProseWrapper>
            <RichText content={content} />
          </ProseWrapper>
        </section>
      )}

      {/* Related Coins */}
      <ArticleRelatedCoinBoxes coins={item.relatedCoins} />
    </article>
  )
}
