import { Article } from '@models/Article.model'
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
    // GraphCMS payload (see https://graphcms.com/docs/api-reference/basics/webhooks#receiving-a-webhook)
    const payload = req?.body?.data || {}
    const model = payload?.__typename
    const articleType = payload?.articleType
    const slug = payload?.slug

    // Revalidate article-pages
    if (model === 'Article' && slug && articleType) {
      const basePath = Article.getArticleTypeBasePath(articleType)
      console.log('Revalidating:', `${basePath}/${slug}`)
      await res.revalidate(`${basePath}/${slug}`)
    }

    // Revalidate resource-pages
    if (model === 'Resource' && slug) {
      console.log('Revalidating:', `/resources/${slug}`)
      await res.revalidate(`/resources/${slug}`)
    }

    // Revalidate coin-pages
    if (model === 'Coin' && slug) {
      console.log('Revalidating:', `/coins/${slug}`)
      await res.revalidate(`/coins/${slug}`)
    }

    // Always revalidate all static pages
    res.revalidate(`/`)
    // res.revalidate(`/about`)
    // res.revalidate(`/404`)

    return res.status(200).json({ revalidated: true })
  } catch (err) {
    console.error('Error while revalidating:', err)
    return res.status(500).send('Error revalidating')
  }
}
