import {
  generateRichTextContentTOC,
  sanitizeRichTextContent,
} from '@components/shared/richtextcontentHelpers'
import { RichText } from '@graphcms/rich-text-react-renderer'
import { Article, ArticleType } from '@models/Article.model'
import { Resource } from '@models/Resource.model'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import { HomeContentHeader } from '../home/HomeContentHeader'
import { ProseWrapper } from '../shared/ProseWrapper'
import { ArticleRelatedCoinBoxes } from './ArticleRelatedCoinBoxes'
import { ArticleRelatedTweet } from './ArticleRelatedTweet'

export interface ArticleContentProps {
  item: Article | Resource
}
export const ArticleContent: FC<ArticleContentProps> = ({ item }) => {
  const { title, subtitle, updatedAt, tags } = item
  const [content, setContent] = useState(item.content || [])

  // Sanitize content & generate dynamic ToC
  useEffect(() => {
    let newContent = sanitizeRichTextContent(item.content)
    newContent = generateRichTextContentTOC(item.content)
    setContent(newContent)
  }, [item.content])

  // Scroll to anchor links when content loaded
  const { asPath: path } = useRouter()
  useEffect(() => {
    const pathAnchor = path.split('#')?.[1]
    const anchor = document.getElementById(pathAnchor)
    if (!anchor) return
    anchor.scrollIntoView({ behavior: 'smooth' })
  }, [path, content])

  return (
    <article itemScope itemType="http://schema.org/Article">
      {/* Header */}
      <HomeContentHeader
        {...{ title, subtitle, updatedAt, tags }}
        sharePrefix="Must read 👇"
        hideShareBar={item.articleType === ArticleType.Legal}
      />

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

      {/* Related Tweet */}
      <ArticleRelatedTweet item={item} />
    </article>
  )
}
