import { CryptopanicNews } from '@models/Coin.model'
import { env } from '@shared/environment'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetch latest news from cryptopanic.com for given currency-symbol
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  const limit = (req.body?.limit || 5) as number
  if (!symbol || !limit) return res.status(401).end()

  try {
    const baseUrl = 'https://cryptopanic.com/api/v1/posts/?'
    const baseParams = {
      auth_token: env.cryptopanicApiKey,
      public: 'true',
      currencies: symbol,
      kind: 'news',
    }

    // Fetch 'hot' news first
    let params = new URLSearchParams({ ...baseParams, filter: 'hot' }).toString()
    let response = await axios.get<{ results: CryptopanicNews[] }>(`${baseUrl}${params}`)
    let news = response?.data?.results || []
    news = news.slice(0, Math.min(news.length, limit)).map((n) => ({ ...n, is_hot: true }))

    if (news.length === limit) {
      return res.status(200).json({ news })
    }

    // Fill up with non-'hot' news (if necessary)
    await new Promise((r) => setTimeout(r, 250))
    params = new URLSearchParams(baseParams).toString()
    response = await axios.get<{ results: CryptopanicNews[] }>(`${baseUrl}${params}`)
    news = [...news, ...(response?.data?.results || [])]
    news = news.slice(0, Math.min(news.length, limit))

    return res.status(200).json({ news })
  } catch (e) {
    console.error('Error while fetching data from cryptopanic.com', e)
    res.status(500).end()
  }
}
