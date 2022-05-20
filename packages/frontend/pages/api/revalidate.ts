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
  
  const data = req?.body?.data || {}
  console.log(JSON.stringify(data, null, 2))

  try {
    await res.unstable_revalidate('/')
    return res.status(200).json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
