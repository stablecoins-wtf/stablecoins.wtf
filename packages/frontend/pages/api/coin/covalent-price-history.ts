
import { env } from '@shared/environment'
import { graphCmsClient } from '@shared/graphCmsClient'
import axios from 'axios'
import dayjs from 'dayjs'
import { gql } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from 'next'

export interface CovalentPriceHistory {
  updatedAt: string
  prices: Array<{
    date: string
    price: number
  }>
}

/**
 * Fetch price history from covalent & cache in GraphCMS
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  if (!symbol) return res.status(401).end()

  // NOTE: The following symbols are not present on Covalent
  if (['USDD', 'USDX', 'SUSD', 'CUSD', 'VAI', 'MUSD'].includes(symbol.toUpperCase())) {
    return res.status(404).end()
  }

  try {
    // Fetch price history from covalent
    const params = new URLSearchParams({
      from: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
      to: dayjs().format('YYYY-MM-DD'),
      'prices-at-asc': 'true',
    }).toString()
    const url = `https://api.covalenthq.com/v1/pricing/historical/USD/${symbol}/?${params}`
    const auth = {
      username: env.covalentApiKey,
      password: '',
    }
    const { data } = await axios.get(url, { auth })
    const prices = (data?.data?.prices || [])
      .map(({ contract_metadata, ...rest }: any) => rest)
    const cvPriceHistory: CovalentPriceHistory = {
      updatedAt: dayjs().toISOString(),
      prices
    }

    // Update in GraphCMS (async)
    const query = gql`
      mutation UpdateAndPublishCoin($symbol: String!, $cvPriceHistory: Json!) {
        updateCoin(
          where: { symbol: $symbol }
          data: { cvPriceHistory: $cvPriceHistory }
        ) {
          id
        }
        publishCoin(where: { symbol: $symbol }, to: PUBLISHED) {
          id
        }
      }
    `
    graphCmsClient.request(query, { symbol, cvPriceHistory })

    res.status(200).json({ cvPriceHistory })
    
  } catch (e) {
    console.error('Error while fetching data from covalent', e)
    res.status(500).end()
  }
}
