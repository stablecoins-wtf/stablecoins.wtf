import { CoinapiPriceHistory } from '@models/Coin.model'
import { env } from '@shared/environment'
import { graphCmsClient } from '@shared/graphCmsClient'
import axios from 'axios'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetch price history from covalent & cache in GraphCMS
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  if (!symbol) return res.status(401).end()

  // NOTE: The following symbols are not present on Covalent
  if (['OUSD', 'USDP', 'FRAX'].includes(symbol.toUpperCase())) {
    return res.status(404).end()
  }

  try {
    // Fetch price history from covalent
    const params = new URLSearchParams({
      period_id: '1DAY',
      time_start: dayjs().subtract(3, 'month').toISOString(),
      time_end: dayjs().toISOString(),
      limit: '1000',
    }).toString()
    const url = `https://rest.coinapi.io/v1/exchangerate/${symbol.toUpperCase()}/USD/history?${params}`

    const headers = { 'X-CoinAPI-Key': env.coinapiApiKey }
    const { data } = await axios.get(url, { headers })
    const prices = (data || [])
      .filter(Boolean)
      .map((p: any) => ({
        date: p.time_period_start,
        price: p.rate_open,
      }))

    const capiPriceHistory: CoinapiPriceHistory = {
      updatedAt: dayjs().toISOString(),
      prices
    }

    // Update in GraphCMS (async)
    const query = gql`
      mutation UpdateAndPublishCoin($symbol: String!, $capiPriceHistory: Json!) {
        updateCoin(
          where: { symbol: $symbol }
          data: { capiPriceHistory: $capiPriceHistory }
        ) {
          id
        }
        publishCoin(where: { symbol: $symbol }, to: PUBLISHED) {
          id
        }
      }
    `
    graphCmsClient.request(query, { symbol, capiPriceHistory })

    res.status(200).json({ capiPriceHistory })
    
  } catch (e) {
    console.error('Error while fetching data from covalent', e)
    res.status(500).end()
  }
}
