import { Article, ArticleType } from '@models/Article.model'
import { Coin } from '@models/Coin.model'
import { CG_TRADING_DATA_MAX_AGE_MINUTES } from '@pages/api/coin/coingecko-trading-data'
import axios from 'axios'
import dayjs from 'dayjs'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'
import { ArticlesDataProps, getAllArticles } from './getAllArticles'
import { CoinsDataProps, getAllCoinsAndMetadata } from './getAllCoinsAndMetadata'

/**
 * Merges & optimizes the following into globally shared static props:
 * - `getAllCoinsAndMetadata`
 * - `getAllArticles`
 */
export type SharedStaticProps = CoinsDataProps & ArticlesDataProps
export enum SharedStatisPropsPage {
  INDEX = 'index',
  ABOUT = 'about',
  COIN = 'coin',
  ARTICLE = 'article',
  RESOURCE = 'resource',
  LEGAL = 'legal',
}
export const getSharedStaticPropsFor =
  (page: SharedStatisPropsPage): GetStaticProps =>
  async (context) => {
    const sharedStaticPropsData = await Promise.all([getAllCoinsAndMetadata(), getAllArticles()])

    const { coinsData, articlesData } = doSharedStaticPropsOptimizations(
      page,
      context,
      sharedStaticPropsData,
    )

    return {
      props: {
        coinsData,
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
  resources: Article[]
  articles: Article[]
  legal: Article[]
}
export const useSharedStaticProps = ({
  coinsData,
  articlesData,
}: SharedStaticProps): ParsedSharedStaticProps => {
  // Initialize Coins
  const [coins, setCoins] = useState<Coin[]>([])
  useEffect(() => {
    setCoins((coinsData || []).map(Coin.fromObject).filter(Boolean) as Coin[])
  }, [coinsData])

  // Initialize Articles (Blog Post Articles, Legal Documents, and Resources)
  const [articles, setArticles] = useState<Article[]>([])
  const [legal, setLegal] = useState<Article[]>([])
  const [resources, setResources] = useState<Article[]>([])
  useEffect(() => {
    const allArticles = (articlesData || [])
      .map((data) => {
        const a = Article.fromObject(data)
        // Initialize coin-reference(s)
        a?.initRelatedCoins(data, coins, a?.articleType === ArticleType.Article)
        return a
      })
      .filter(Boolean) as Article[]

    setArticles(allArticles.filter((a) => a?.articleType === ArticleType.Article))
    setLegal(allArticles.filter((a) => a?.articleType === ArticleType.Legal))
    setResources(allArticles.filter((a) => a?.articleType === ArticleType.Resource))
  }, [articlesData, coins])

  // Check & initiate trading-data update (if outdated)
  const MAX_UPDATE_COINS = 5
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
    let refetchCounter = 0
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
      if ((!updatedAt || (isOutdated && isIdle)) && refetchCounter < MAX_UPDATE_COINS) {
        refetchCounter++
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
  [{ coinsData }, { articlesData }]: [CoinsDataProps, ArticlesDataProps],
): SharedStaticProps => {
  const P = SharedStatisPropsPage
  const { slug } = context?.params || {}

  articlesData = (articlesData || []).map((article: Article) => {
    const isNoArticlePage = ![P.ARTICLE, P.LEGAL, P.RESOURCE].includes(page)
    const isOtherArticlePage = slug && article.slug !== slug
    if (isNoArticlePage || isOtherArticlePage) {
      delete article.content
    }
    return article
  })
  coinsData = (coinsData || []).map((coin: Coin) => {
    const isNoCoin = ![P.COIN].includes(page)
    const isOtherCoin = slug && coin.slug !== slug
    if (isNoCoin || isOtherCoin) {
      delete coin.description
    }
    return coin
  })

  return { articlesData, coinsData }
}
