import { env } from '@shared/environment'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetch latest news from cryptopanic.com for given currency-symbol
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const symbol = req.body?.symbol as string
  const limit = req.body?.limit as number
  if (!symbol) return res.status(401).end()

  try {
    const params = new URLSearchParams({
      auth_token: env.cryptopanicApiKey,
      public: 'true',
      currencies: symbol,
      kind: 'news',
    }).toString()
    let { data } = await axios.get(`https://cryptopanic.com/api/v1/posts/?${params}`)
    let news = data.results 
    if (limit) news = news.slice(0, Math.min(news.length, 5))
    res.status(200).json({ news })
    
  } catch (e) {
    console.error('Error while fetching data from cryptopanic.com', e)
    res.status(500).end()
  }
}
