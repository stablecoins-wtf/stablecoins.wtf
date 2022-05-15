import { env } from '@shared/environment'
import { NextApiRequest, NextApiResponse } from 'next'

/**
 * On-Demand Revalidation
 * https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#using-on-demand-revalidation
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers['RevalidateToken'] !== env.revalidateToken) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    await res.unstable_revalidate('/')
    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
