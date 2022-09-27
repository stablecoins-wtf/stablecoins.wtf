import { Article } from '@models/Article.model'
import { Coin } from '@models/Coin.model'
import { Resource } from '@models/Resource.model'
import { CG_TRADING_DATA_MAX_AGE_MINUTES } from '@pages/api/coin/coingecko-trading-data'
import axios from 'axios'
import dayjs from 'dayjs'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'
import { ArticlesDataProps, getAllArticles } from './getAllArticles'
import { CoinsDataProps, getAllCoinsAndMetadata } from './getAllCoinsAndMetadata'
import { getAllResources, ResourcesDataProps } from './getAllResources'

/**
 * Merges the following into globally shared static props:
 * - `getAllCoinsAndMetadata`
 * - `getAllResources`
 */
export type SharedStaticProps = CoinsDataProps & ResourcesDataProps & ArticlesDataProps
export const getSharedStaticProps: GetStaticProps = async () => {
  const [coinsData, resourcesData, articlesData] = await Promise.all([
    getAllCoinsAndMetadata(),
    getAllResources(),
    getAllArticles(),
  ])

  return {
    props: {
      ...coinsData,
      ...resourcesData,
      ...articlesData,
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
