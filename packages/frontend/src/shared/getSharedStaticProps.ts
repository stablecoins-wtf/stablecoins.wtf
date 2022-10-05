import { Article } from '@models/Article.model'
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
      revalidate: 60 * 2, // 2 minutes
    }
  }

/**
 * Helper hook to extract and parse fetched data into respective models
 */
export interface ParsedSharedStaticProps {
  coins: Coin[]
  resources: Resource[]
  articles: Article[]
}
export const useSharedStaticProps = ({
  coinsData,
  resourcesData,
  articlesData,
}: SharedStaticProps): ParsedSharedStaticProps => {
  // Initialize Coins
  const getCoins = () => (coinsData || []).map(Coin.fromObject).filter(Boolean) as Coin[]
  const [coins] = useState(getCoins())

  // Initialize Resources
  const getResources = () =>
    (resourcesData || []).map(Resource.fromObject).filter(Boolean) as Resource[]
  const [resources] = useState(getResources())

  // Initialize Articles
  const getArticles = () =>
    (articlesData || []).map(Article.fromObject).filter(Boolean) as Article[]
  const [articles] = useState(getArticles())

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
      const { refetch, isIdle } = results[idx]
      const coin = coins[idx]
      const updatedAt = coin.cgTradingData?.updatedAt
      const isOutdated = dayjs().diff(updatedAt, 'minute', true) > CG_TRADING_DATA_MAX_AGE_MINUTES
      if (!updatedAt || (isOutdated && isIdle)) {
        refetch()
      }
    }
  }, [coins])

  return { coins, resources, articles }
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
