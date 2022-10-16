import { gql } from 'graphql-request'
import { cache } from './buildCache'
import { graphCmsClient } from './graphCmsClient'

/**
 * Query articles from GraphCMS
 */
export interface ArticlesDataProps {
  articlesData: any[]
}
export const getAllArticles = async (): Promise<ArticlesDataProps> => {
  const articlesData = await fetchOrGetArticles()
  return { articlesData }
}

/**
 * Ether fetches `articlesData` or returns it from the local-file `.cache`
 */
export const fetchOrGetArticles = async (forceFetch?: boolean) => {
  let articlesData = await cache.get('articles')
  if (articlesData && !forceFetch) return articlesData

  articlesData = await queryGraphCms()

  await cache.set('articles', articlesData)
  return articlesData
}

/**
 * Fetches all articles from the GraphCMS database.
 */
const queryGraphCms = async () => {
  const query = gql`
    query Articles {
      articles {
        id
        documentInStages(stages: PUBLISHED) {
          id
        }
        createdAt
        createdAtOverwrite
        updatedAt
        title
        subtitle
        slug
        content {
          raw
        }
        tags
        relatedCoins {
          id
        }
        relatedTweetId
      }
    }
  `
  const { articles } = await graphCmsClient.request(query)
  return articles
}
