import { CoingeckoTradingData } from '@models/Coin.model'
import { graphCmsClient } from '@shared/graphCmsClient'
import axios from 'axios'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetch price history from CoinGecko & cache in GraphCMS
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  const coingeckoId = req.body?.coingeckoId as string
  if (!symbol || !coingeckoId) return res.status(401).end()

  try {
    // Fetch price history from covalent
    const params = new URLSearchParams({
      vs_currency: 'USD',
      days: '90',
      interval: 'daily',
    }).toString()
    const url = `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?${params}`
    const { data } = await axios.get<CoingeckoTradingData>(url)
    const cgTradingData = {
      ...data,
      updatedAt: dayjs().toISOString(),
    }

    // Update in GraphCMS (async)
    const query = gql`
      mutation UpdateAndPublishCoin($symbol: String!, $cgTradingData: Json!) {
        updateCoin(
          where: { symbol: $symbol }
          data: { cgTradingData: $cgTradingData }
        ) {
          id
        }
        publishCoin(where: { symbol: $symbol }, to: PUBLISHED) {
          id
        }
      }
    `
    graphCmsClient.request(query, { symbol, cgTradingData })

    res.status(200).json({ cgTradingData })

  } catch (e) {
    console.error('Error while fetching data from covalent', e)
    res.status(500).end()
  }
}
