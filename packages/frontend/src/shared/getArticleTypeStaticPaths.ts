import { ArticleType } from '@models/Article.model'
import { GetStaticPaths } from 'next'
import { fetchOrGetArticles } from './getAllArticles'

/**
 * Returns dynamic `getStaticPaths` function for given
 * article-type (blog post article, resource, legal).
 */
export const getArticleTypeStaticPaths =
  (type: ArticleType): GetStaticPaths =>
  async () => {
    const articlesData = await fetchOrGetArticles()
    const paths = (articlesData || [])
      .filter((articleData: any) => !!articleData?.slug)
      .filter((articleData: any) => articleData.articleType === type)
      .map((articleData: any) => ({
        params: { slug: articleData.slug },
      }))

    return {
      paths,
      fallback: true,
    }
  }
