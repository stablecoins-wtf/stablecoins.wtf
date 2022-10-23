import { CoingeckoTradingData } from '@models/Coin.model'
import { env } from '@shared/environment'
import { graphCmsClient } from '@shared/graphCmsClient'
import axios from 'axios'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetch price history from CoinGecko & cache in GraphCMS
 */
export const CG_TRADING_DATA_MAX_AGE_MINUTES = 60 * 2
export const CG_TRADING_DATA_MAX_AGE_MINUTES_FOR_DRAFTS = 60 * 24
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  const coingeckoId = req.body?.coingeckoId as string
  if (!symbol || !coingeckoId) return res.status(401).end()

  try {
    // Fetch cached price history from GraphCMS
    const query = gql`
      query Coin($symbol: String!) {
        coin(where: { symbol: $symbol }) {
          id
          documentInStages(stages: PUBLISHED) {
            id
          }
          cgTradingData
        }
      }
    `

    // Check if coin exists
    const graphCmsData = await graphCmsClient.request(query, { symbol })
    if (!graphCmsData?.coin?.id) {
      return res.status(404).end()
    }

    // Determine whether an update is due
    const cachedCgTradingData: CoingeckoTradingData = graphCmsData?.coin?.cgTradingData || {}
    const updatedAt = cachedCgTradingData?.updatedAt
    const isDraft = !graphCmsData?.coin?.documentInStages?.length && !env.isProduction
    const isOutdated =
      dayjs().diff(updatedAt, 'minute', true) >
      (isDraft ? CG_TRADING_DATA_MAX_AGE_MINUTES_FOR_DRAFTS : CG_TRADING_DATA_MAX_AGE_MINUTES)
    if (updatedAt && !isOutdated) {
      return res.status(200).end()
    }

    // Fetch price history from CoinGecko
    const params = new URLSearchParams({
      vs_currency: 'USD',
      days: '90',
      interval: 'daily',
    }).toString()
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?${params}`
    const { data: cgData } = await axios.get<CoingeckoTradingData>(url)
    const cgTradingData = {
      ...cgData,
      updatedAt: dayjs().toISOString(),
    }

    // Send back to client
    res.status(200).json({ cgTradingData })
    // res.status(200).end()

    // Update in GraphCMS (async)
    try {
      const publishMutation = `
        publishCoin(where: { symbol: $symbol }, to: PUBLISHED) {
          id
        }
      `
      const mutation = gql`
        mutation UpdateAndPublishCoin($symbol: String!, $cgTradingData: Json!) {
          updateCoin(where: { symbol: $symbol }, data: { cgTradingData: $cgTradingData }) {
            id
          }
          ${isDraft ? '' : publishMutation}
        }
      `
      await graphCmsClient.request(mutation, { symbol, cgTradingData })
    } catch (e) {
      console.error('Error while updating GraphCMS')
    }
  } catch (e) {
    console.error('Error while updating coingecko trading-data:', e)
    res.status(500).end()
  }
}
