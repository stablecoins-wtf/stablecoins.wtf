import { env } from '@shared/environment'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * On-Demand Revalidation
 * https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['revalidatetoken'] !== env.revalidateToken) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.revalidate('/')

    // GraphCMS payload (see https://graphcms.com/docs/api-reference/basics/webhooks#receiving-a-webhook)
    const payload = req?.body?.data || {}
    const model = payload?.__typename
    const slug = payload?.slug

    // Revalidate article-pages
    if (model === 'Article' && slug) {
      res.revalidate(`/articles/${slug}`)
    }

    // Revalidate resource-pages
    if (model === 'Resource' && slug) {
      res.revalidate(`/resources/${slug}`)
    }

    // Revalidate coin-pages
    if (model === 'Coin' && slug) {
      res.revalidate(`/coins/${slug}`)
    }

    return res.status(200).json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
