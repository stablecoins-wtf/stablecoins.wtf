import { Article, ArticleType } from '@models/Article.model'
import { Coin } from '@models/Coin.model'
import { Resource } from '@models/Resource.model'
import { CG_TRADING_DATA_MAX_AGE_MINUTES } from '@pages/api/coin/coingecko-trading-data'
import axios from 'axios'
import dayjs from 'dayjs'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'
import { ArticlesDataProps, getAllArticles } from './getAllArticles'
import { CoinsDataProps, getAllCoinsAndMetadata } from './getAllCoinsAndMetadata'
import { getAllResources, ResourcesDataProps } from './getAllResources'

/**
 * Merges & optimizes the following into globally shared static props:
 * - `getAllCoinsAndMetadata`
 * - `getAllResources`
 * - `getAllArticles`
 */
export type SharedStaticProps = CoinsDataProps & ResourcesDataProps & ArticlesDataProps
export enum SharedStatisPropsPage {
  INDEX = 'index',
  ABOUT = 'about',
  COIN = 'coin',
  ARTICLE = 'article',
  RESOURCE = 'resource',
}
export const getSharedStaticPropsFor =
  (page: SharedStatisPropsPage): GetStaticProps =>
  async (context) => {
    const sharedStaticPropsData = await Promise.all([
      getAllCoinsAndMetadata(),
      getAllResources(),
      getAllArticles(),
    ])

    const { coinsData, resourcesData, articlesData } = doSharedStaticPropsOptimizations(
      page,
      context,
      sharedStaticPropsData,
    )

    return {
      props: {
        coinsData,
        resourcesData,
        articlesData,
      } as SharedStaticProps,
      revalidate: 60 * 10, // 10 minutes
    }
  }

/**
 * Helper hook to extract and parse fetched data into respective models
 */
export interface ParsedSharedStaticProps {
  coins: Coin[]
  resources: Resource[]
  articles: Article[]
  legal: Article[]
}
export const useSharedStaticProps = ({
  coinsData,
  resourcesData,
  articlesData,
}: SharedStaticProps): ParsedSharedStaticProps => {
  // Initialize Coins
  const [coins, setCoins] = useState<Coin[]>([])
  useEffect(() => {
    setCoins((coinsData || []).map(Coin.fromObject).filter(Boolean) as Coin[])
  }, [coinsData])

  // Initialize Resources
  const [resources, setResources] = useState<Resource[]>([])
  useEffect(() => {
    setResources(
      (resourcesData || [])
        // Initialize coin-reference(s)
        .map((data) => {
          const r = Resource.fromObject(data)
          r?.initRelatedCoins(data, coins)
          return r
        })
        .filter(Boolean) as Resource[],
    )
  }, [resourcesData, coins])

  // Initialize Articles (Blog Post Articles, Legal Documents, and Resources)
  const [articles, setArticles] = useState<Article[]>([])
  const [legal, setLegal] = useState<Article[]>([])
  useEffect(() => {
    const allArticles = (articlesData || [])
      .map((data) => {
        const a = Article.fromObject(data)
        // Initialize coin-reference(s)
        a?.initRelatedCoins(data, coins, true)
        return a
      })
      .filter(Boolean) as Article[]

    setArticles(allArticles.filter((a) => a?.articleType === ArticleType.Article))
    setLegal(allArticles.filter((a) => a?.articleType === ArticleType.Legal))
  }, [articlesData, coins])

  // Check & initiate trading-data update (if outdated)
  const getQuery = (coin: Coin) => () =>
    axios.post('/api/coin/coingecko-trading-data', {
      symbol: coin.symbol,
      coingeckoId: coin.coingeckoId,
    })
  const results = useQueries(
    coins.map((coin) => ({
      queryKey: ['trading-data', coin.symbol],
      queryFn: getQuery(coin),
      enabled: false,
      retry: false,
    })),
  )
  useEffect(() => {
    for (let idx = 0; idx < coins.length; idx++) {
      const { refetch, isIdle, data } = results[idx]
      const coin = coins[idx]

      // Swap out `cgTradingData` if new exists
      const cgTradingData = data?.data?.cgTradingData
      if (cgTradingData) {
        coin.cgTradingData = cgTradingData
        coin.latestQuotes.reInitialize()
        continue
      }

      // Initialize update of `cgTradingData` if outdated
      const updatedAt = coin.cgTradingData?.updatedAt
      const isOutdated = dayjs().diff(updatedAt, 'minute', true) > CG_TRADING_DATA_MAX_AGE_MINUTES
      if (!updatedAt || (isOutdated && isIdle)) {
        refetch()
      }
    }
  }, [coins])

  return { coins, resources, articles, legal }
}

/**
 * Helper that optimizes payload by stripping unecessary data for certain pages
 */
const doSharedStaticPropsOptimizations = (
  page: SharedStatisPropsPage,
  context: GetStaticPropsContext,
  [{ coinsData }, { resourcesData }, { articlesData }]: [
    CoinsDataProps,
    ResourcesDataProps,
    ArticlesDataProps,
  ],
): SharedStaticProps => {
  const P = SharedStatisPropsPage
  if ([P.INDEX, P.ABOUT, P.ARTICLE, P.COIN].includes(page)) {
    resourcesData = (resourcesData || []).map((resource: Resource) => {
      delete resource.content
      return resource
    })
  }
  if ([P.INDEX, P.ABOUT, P.RESOURCE, P.COIN].includes(page)) {
    articlesData = (articlesData || []).map((article: Article) => {
      delete article.content
      return article
    })
  }
  if ([P.INDEX, P.ABOUT, P.ARTICLE, P.RESOURCE].includes(page)) {
    coinsData = (coinsData || []).map((coin: Coin) => {
      delete coin.description
      return coin
    })
  }

  return { resourcesData, articlesData, coinsData }
}
